package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.entity.MovieViewCount;
import mocphim.com.backend_web.repository.MovieViewCountRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import redis.clients.jedis.UnifiedJedis;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieViewCountService {

    private final MovieViewCountRepository viewCountRepository;
    private final UnifiedJedis jedis;

    private static final long VIEW_COOLDOWN_SECONDS = 86400; // 24h

    @Transactional
    public Map<String, Long> increment(String slug, String viewerKey) {
        String redisKey = "view:" + slug + ":" + viewerKey;

        // Đã xem trong 24h → trả về count hiện tại, không cộng
        if (jedis.exists(redisKey)) {
            return getCount(slug);
        }
        jedis.setex(redisKey, VIEW_COOLDOWN_SECONDS, "1");

        String today = LocalDate.now().toString();

        MovieViewCount record = viewCountRepository.findBySlug(slug)
                .orElseGet(() -> {
                    MovieViewCount newRecord = new MovieViewCount();
                    newRecord.setSlug(slug);
                    newRecord.setViewCount(0L);
                    newRecord.setViewCountToday(0L);
                    return newRecord;
                });

        record.setViewCount(record.getViewCount() + 1);

        if (today.equals(record.getLastResetDate())) {
            record.setViewCountToday(record.getViewCountToday() + 1);
        } else {
            record.setViewCountToday(1L);
            record.setLastResetDate(today);
        }

        record.setUpdatedAt(LocalDateTime.now());
        viewCountRepository.save(record);

        return Map.of("viewCount", record.getViewCount(), "viewCountToday", record.getViewCountToday());
    }

    public Map<String, Long> getCount(String slug) {
        return viewCountRepository.findBySlug(slug)
                .map(r -> Map.of("viewCount", r.getViewCount(), "viewCountToday", r.getViewCountToday()))
                .orElse(Map.of("viewCount", 0L, "viewCountToday", 0L));
    }

    public Map<String, Long> getBatch(List<String> slugs) {
        if (slugs.isEmpty()) return Map.of();
        return viewCountRepository.findBySlugIn(slugs).stream()
                .collect(Collectors.toMap(MovieViewCount::getSlug, MovieViewCount::getViewCount));
    }

    public long getTodayTotal() {
        String today = LocalDate.now().toString();
        Long total = viewCountRepository.sumViewCountToday(today);
        return total != null ? total : 0L;
    }

    public List<MovieViewCount> getTopViewed(int limit) {
        return viewCountRepository.findAllByOrderByViewCountDesc(PageRequest.of(0, limit));
    }
}
