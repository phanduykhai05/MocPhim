package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.request.WatchProgressRequestDto;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.WatchProgressResponseDto;
import mocphim.com.backend_web.security.CustomUserDetails;
import mocphim.com.backend_web.service.WatchProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class WatchProgressController {

    private final WatchProgressService watchProgressService;

    @GetMapping("/{userId}/{movieId}/{episodeNumber}")
    public ResponseEntity<ApiResponse<WatchProgressResponseDto>> getProgress(
            @PathVariable Long userId,
            @PathVariable String movieId,
            @PathVariable int episodeNumber,
            @AuthenticationPrincipal CustomUserDetails principal) {
        validateOwner(userId, principal);
        return ResponseEntity.ok(ApiResponse.success(
                watchProgressService.getProgress(userId, movieId, episodeNumber)));
    }

    @GetMapping("/{userId}/{movieId}")
    public ResponseEntity<ApiResponse<List<WatchProgressResponseDto>>> getAllProgress(
            @PathVariable Long userId,
            @PathVariable String movieId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        validateOwner(userId, principal);
        return ResponseEntity.ok(ApiResponse.success(
                watchProgressService.getAllProgress(userId, movieId)));
    }

    @GetMapping("/{userId}/resume/{slug}")
    public ResponseEntity<ApiResponse<WatchProgressResponseDto>> getResumePoint(
            @PathVariable Long userId,
            @PathVariable String slug,
            @AuthenticationPrincipal CustomUserDetails principal) {
        validateOwner(userId, principal);
        return ResponseEntity.ok(ApiResponse.success(
                watchProgressService.getResumePoint(userId, slug)));
    }

    @PatchMapping("/{userId}/{movieId}/{episodeNumber}")
    public ResponseEntity<ApiResponse<WatchProgressResponseDto>> updateProgress(
            @PathVariable Long userId,
            @PathVariable String movieId,
            @PathVariable int episodeNumber,
            @RequestBody WatchProgressRequestDto request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        validateOwner(userId, principal);
        return ResponseEntity.ok(ApiResponse.success(
                watchProgressService.updateProgress(userId, movieId, episodeNumber, request)));
    }

    private void validateOwner(Long userId, CustomUserDetails principal) {
        if (!principal.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Không có quyền truy cập dữ liệu của người dùng khác");
        }
    }
}
