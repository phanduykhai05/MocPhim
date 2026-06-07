package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.entity.MovieSync;
import mocphim.com.backend_web.repository.MovieSyncRepository;
import mocphim.com.backend_web.scheduler.MovieSyncScheduler;
import mocphim.com.backend_web.service.MovieSyncService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/sync")
@RequiredArgsConstructor
public class SyncController {

    private final MovieSyncService movieSyncService;
    private final MovieSyncScheduler movieSyncScheduler;
    private final MovieSyncRepository movieSyncRepository;

    @GetMapping("/movies")
    public ResponseEntity<ApiResponse<Object>> getSyncedMovies(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        Page<MovieSync> result = movieSyncService.getPage(page, size);
        ApiResponse.Pagination pagination = new ApiResponse.Pagination(
            result.getNumber() + 1,
            result.getTotalPages(),
            result.getTotalElements(),
            result.getSize()
        );
        return ResponseEntity.ok(ApiResponse.success(result.getContent(), pagination));
    }

    @GetMapping("/movies/all")
    public ResponseEntity<ApiResponse<Object>> getAllSyncedMovies() {
        return ResponseEntity.ok(ApiResponse.success(movieSyncService.getTop500()));
    }

    @GetMapping("/movies/count")
    public ResponseEntity<ApiResponse<Object>> count() {
        return ResponseEntity.ok(ApiResponse.success(movieSyncService.count()));
    }

    @PostMapping("/movies/trigger")
    public ResponseEntity<ApiResponse<Object>> triggerSync(
        @RequestParam(defaultValue = "1") int startPage,
        @RequestParam(defaultValue = "50") int maxPages
    ) {
        int[] result = movieSyncScheduler.syncFromPage(startPage, maxPages);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "added", result[0],
            "skipped", result[1]
        )));
    }

    /**
     * Re-sync đồng bộ — trả về kết quả sau khi xong (dùng khi limit nhỏ).
     * @param limit số lượng slug xử lý (mặc định 100, tối đa 500)
     */
    @PostMapping("/movies/resync")
    public ResponseEntity<ApiResponse<Object>> resyncMissingFields(
        @RequestParam(defaultValue = "100") int limit
    ) {
        int safeLimit = Math.min(limit, 500);
        return ResponseEntity.ok(ApiResponse.success(movieSyncService.resyncMissingFields(safeLimit)));
    }

    /**
     * Re-sync bất đồng bộ — trả về ngay lập tức, xử lý toàn bộ trong nền.
     * Theo dõi tiến trình qua docker logs.
     */
    @PostMapping("/movies/resync-all")
    public ResponseEntity<ApiResponse<Object>> resyncAllAsync() {
        long remaining = movieSyncRepository.countByOphimIdIsNull();
        if (remaining == 0) {
            return ResponseEntity.ok(ApiResponse.success("Không có phim nào cần resync"));
        }
        movieSyncService.resyncAllAsync();
        return ResponseEntity.ok(ApiResponse.success(
            Map.of("message", "Resync đang chạy trong nền", "totalQueued", remaining)
        ));
    }
}
