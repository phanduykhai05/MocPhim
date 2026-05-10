package mocphim.com.backend_web.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mocphim.com.backend_web.entity.MovieSync;
import mocphim.com.backend_web.repository.MovieSyncRepository;
import mocphim.com.backend_web.service.MovieSyncService;
import mocphim.com.backend_web.service.OPhimService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
@ConditionalOnProperty(name = "scheduler.movie-sync.enabled", havingValue = "true")
public class MovieSyncScheduler {

    private static final int MAX_PAGES_PER_RUN = 50;

    private final OPhimService ophimService;
    private final MovieSyncRepository movieSyncRepository;
    private final MovieSyncService movieSyncService;

    @Scheduled(cron = "${scheduler.movie-sync.cron}")
    public void sync() {
        syncFromPage(1, MAX_PAGES_PER_RUN);
    }

    public int[] syncFromPage(int startPage, int maxPages) {
        int added = 0;
        int skipped = 0;

        try {
            for (int page = startPage; page <= startPage + maxPages - 1; page++) {
                Map<String, String> params = Map.of("page", String.valueOf(page));
                Object response = ophimService.get("/danh-sach/phim-moi", params);

                if (!(response instanceof Map<?, ?> map) ||
                    !(map.get("data") instanceof Map<?, ?> data)) break;

                Object items = data.get("items");
                if (!(items instanceof List<?> list) || list.isEmpty()) break;

                int pageAdded = 0;
                for (Object item : list) {
                    if (item instanceof Map<?, ?> movie) {
                        String slug  = (String) movie.get("slug");
                        String title = (String) movie.get("name");
                        if (slug == null) continue;

                        if (movieSyncRepository.existsBySlug(slug)) {
                            skipped++;
                        } else {
                            MovieSync entity = new MovieSync(slug, title);
                            movieSyncService.applyMovieFields(entity, movie);
                            movieSyncRepository.save(entity);
                            added++;
                            pageAdded++;
                        }
                    }
                }

                if (pageAdded == 0) {
                    log.debug("[SYNC] Trang {} toàn slug đã biết, dừng sớm", page);
                    break;
                }

                if (data.get("params") instanceof Map<?, ?> p &&
                    p.get("pagination") instanceof Map<?, ?> pagination) {
                    int total = ((Number) pagination.get("totalItems")).intValue();
                    int perPage = ((Number) pagination.get("totalItemsPerPage")).intValue();
                    int totalPages = (int) Math.ceil((double) total / perPage);
                    if (page >= totalPages) break;
                }
            }
        } catch (Exception e) {
            log.warn("[SYNC] OPhim error: {}", e.getMessage());
        }

        log.info("[SYNC] Thêm mới {} phim, bỏ qua {} phim", added, skipped);
        if (added > 0) movieSyncService.clearCache();
        return new int[]{added, skipped};
    }
}
