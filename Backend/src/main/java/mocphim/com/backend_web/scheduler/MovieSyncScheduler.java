package mocphim.com.backend_web.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mocphim.com.backend_web.entity.MovieSync;
import mocphim.com.backend_web.repository.MovieSyncRepository;
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

    private final OPhimService ophimService;
    private final MovieSyncRepository movieSyncRepository;

    @Scheduled(cron = "${scheduler.movie-sync.cron}")
    public void sync() {
        try {
            Object response = ophimService.get("/danh-sach/phim-moi");
            int added = 0;
            int skipped = 0;

            if (response instanceof Map<?, ?> map &&
                map.get("data") instanceof Map<?, ?> data) {
                Object items = data.get("items");
                if (items instanceof List<?> list) {
                    for (Object item : list) {
                        if (item instanceof Map<?, ?> movie) {
                            String slug  = (String) movie.get("slug");
                            String title = (String) movie.get("name");
                            if (slug == null) continue;

                            if (movieSyncRepository.existsBySlug(slug)) {
                                skipped++;
                            } else {
                                movieSyncRepository.save(new MovieSync(slug, title));
                                added++;
                            }
                        }
                    }
                }
            }

            log.info("[SYNC] Thêm mới {} phim, bỏ qua {} phim", added, skipped);
        } catch (Exception e) {
            log.warn("[SYNC] OPhim error: {}", e.getMessage());
        }
    }
}
