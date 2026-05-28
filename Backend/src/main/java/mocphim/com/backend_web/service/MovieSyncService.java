package mocphim.com.backend_web.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mocphim.com.backend_web.entity.MovieSync;
import mocphim.com.backend_web.exception.OPhimApiException;
import mocphim.com.backend_web.repository.MovieSyncRepository;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class MovieSyncService {

    private final MovieSyncRepository movieSyncRepository;
    private final OPhimService ophimService;
    private final CacheManager cacheManager;
    private final ObjectMapper objectMapper;

    @Cacheable(value = "syncedMovies", key = "'page_' + #page + '_' + #size")
    public Page<MovieSync> getPage(int page, int size) {
        return movieSyncRepository.findAll(
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
    }

    @Cacheable(value = "syncedMovies", key = "'count'")
    public long count() {
        return movieSyncRepository.count();
    }

    @Cacheable(value = "syncedMovies", key = "'all'")
    public List<MovieSync> getTop500() {
        return movieSyncRepository.findAll(
            PageRequest.of(0, 500, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
    }

    public Map<String, Long> resyncMissingFields(int limit) {
        List<MovieSync> toResync = movieSyncRepository
            .findByOphimIdIsNull(PageRequest.of(0, limit))
            .getContent();

        int updated = 0;
        int notFound = 0;
        int failed = 0;

        for (MovieSync entity : toResync) {
            try {
                Object response = ophimService.get("/phim/" + entity.getSlug());
                Map<?, ?> movieData = extractMovieData(response);
                if (movieData != null) {
                    applyMovieFields(entity, movieData);
                    movieSyncRepository.save(entity);
                    updated++;
                } else {
                    log.warn("[RESYNC] Response không đúng cấu trúc cho slug '{}', keys: {}",
                        entity.getSlug(),
                        response instanceof Map<?, ?> m ? m.keySet() : response);
                    failed++;
                }
            } catch (OPhimApiException e) {
                if (e.getStatusCode() == 404) {
                    // Slug không tồn tại trên OPhim — set sentinel để bỏ qua ở lần resync sau
                    entity.setOphimId("NOT_FOUND");
                    movieSyncRepository.save(entity);
                    notFound++;
                } else {
                    log.warn("[RESYNC] Lỗi slug {}: {}", entity.getSlug(), e.getMessage());
                    failed++;
                }
            } catch (Exception e) {
                log.warn("[RESYNC] Lỗi slug {}: {}", entity.getSlug(), e.getMessage());
                failed++;
            }
        }

        log.info("[RESYNC] Cập nhật {}, không tìm thấy {}, lỗi {} phim", updated, notFound, failed);
        if (updated > 0) clearCache();

        long remaining = movieSyncRepository.countByOphimIdIsNull();
        return Map.of(
            "updated",  (long) updated,
            "notFound", (long) notFound,
            "failed",   (long) failed,
            "remaining", remaining
        );
    }

    /**
     * OPhim v1 detail endpoint có thể trả về:
     *   { "movie": {...} }        — cấu trúc cũ
     *   { "data": { "item": {...} } } — cấu trúc mới
     */
    private Map<?, ?> extractMovieData(Object response) {
        if (!(response instanceof Map<?, ?> map)) return null;
        if (map.get("movie") instanceof Map<?, ?> movie) return movie;
        if (map.get("data") instanceof Map<?, ?> data &&
            data.get("item") instanceof Map<?, ?> item) return item;
        return null;
    }

    public void applyMovieFields(MovieSync entity, Map<?, ?> movie) {
        entity.setOphimId((String) movie.get("_id"));
        entity.setOriginName((String) movie.get("origin_name"));
        entity.setType((String) movie.get("type"));
        entity.setThumbUrl((String) movie.get("thumb_url"));
        entity.setEpisodeCurrent((String) movie.get("episode_current"));
        entity.setQuality((String) movie.get("quality"));
        entity.setLang((String) movie.get("lang"));
        entity.setDuration((String) movie.get("time"));

        if (movie.get("sub_docquyen") instanceof Boolean b) entity.setSubDocquyen(b);
        if (movie.get("year") instanceof Number n) entity.setYear(n.intValue());

        entity.setAlternativeNames(toJson(movie.get("alternative_names")));
        entity.setCategory(toJson(movie.get("category")));
        entity.setCountry(toJson(movie.get("country")));
        entity.setTmdb(toJson(movie.get("tmdb")));
        entity.setImdb(toJson(movie.get("imdb")));
    }

    public String toJson(Object value) {
        if (value == null) return null;
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    public void clearCache() {
        Cache cache = cacheManager.getCache("syncedMovies");
        if (cache != null) cache.clear();
    }
}
