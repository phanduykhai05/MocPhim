package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.request.WatchProgressRequestDto;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.WatchProgressResponseDto;
import mocphim.com.backend_web.service.WatchProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class WatchProgressController {

    private final WatchProgressService watchProgressService;

    // Lấy tiến trình 1 tập cụ thể — gọi khi user mở tập để player seek đúng vị trí
    @GetMapping("/{userId}/{movieId}/{episodeNumber}")
    public ResponseEntity<ApiResponse<WatchProgressResponseDto>> getProgress(
            @PathVariable Long userId,
            @PathVariable String movieId,
            @PathVariable int episodeNumber) {
        WatchProgressResponseDto response = watchProgressService.getProgress(userId, movieId, episodeNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Lấy tiến trình tất cả tập đã xem của 1 phim — dùng cho trang chi tiết phim
    @GetMapping("/{userId}/{movieId}")
    public ResponseEntity<ApiResponse<List<WatchProgressResponseDto>>> getAllProgress(
            @PathVariable Long userId,
            @PathVariable String movieId) {
        List<WatchProgressResponseDto> response = watchProgressService.getAllProgress(userId, movieId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Upsert tiến trình — gọi mỗi ~30s khi đang xem, khi pause, chuyển tập, đóng trang
    @PatchMapping("/{userId}/{movieId}/{episodeNumber}")
    public ResponseEntity<ApiResponse<WatchProgressResponseDto>> updateProgress(
            @PathVariable Long userId,
            @PathVariable String movieId,
            @PathVariable int episodeNumber,
            @RequestBody WatchProgressRequestDto request) {
        WatchProgressResponseDto response = watchProgressService.updateProgress(userId, movieId, episodeNumber, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
