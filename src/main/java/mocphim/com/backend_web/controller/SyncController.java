package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.entity.MovieSync;
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
     * Re-sync các record chưa có ophim_id (= null) — cần thiết để bookmark hoạt động.
     * Gọi nhiều lần cho đến khi remaining = 0.
     * @param limit số lượng slug xử lý mỗi lần gọi (mặc định 100, tối đa 500)
     */
    @PostMapping("/movies/resync")
    public ResponseEntity<ApiResponse<Object>> resyncMissingFields(
        @RequestParam(defaultValue = "100") int limit
    ) {
        int safeLimit = Math.min(limit, 500);
        return ResponseEntity.ok(ApiResponse.success(movieSyncService.resyncMissingFields(safeLimit)));
    }
}
