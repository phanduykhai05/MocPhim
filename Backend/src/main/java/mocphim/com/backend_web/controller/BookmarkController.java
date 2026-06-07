package mocphim.com.backend_web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.request.BookmarkRequestDto;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.BookmarkResponseDto;
import mocphim.com.backend_web.security.CustomUserDetails;
import mocphim.com.backend_web.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<BookmarkResponseDto>>> getBookmarks(
            @PathVariable Long userId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        validateOwner(userId, principal);
        return ResponseEntity.ok(ApiResponse.success(bookmarkService.getBookmarksByUserId(userId)));
    }

    @GetMapping("/isBookmarked/{userId}/{movieId}")
    public ResponseEntity<ApiResponse<Boolean>> isBookmarked(
            @PathVariable Long userId,
            @PathVariable String movieId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        validateOwner(userId, principal);
        return ResponseEntity.ok(ApiResponse.success(bookmarkService.isBookmarked(userId, movieId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookmarkResponseDto>> addBookmark(
            @Valid @RequestBody BookmarkRequestDto request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        Long userId = principal.getUser().getId();
        return ResponseEntity.ok(ApiResponse.success(bookmarkService.addBookmark(userId, request)));
    }

    @DeleteMapping("/{userId}/{movieId}")
    public ResponseEntity<ApiResponse<String>> deleteBookmark(
            @PathVariable Long userId,
            @PathVariable String movieId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        validateOwner(userId, principal);
        bookmarkService.deleteBookmark(userId, movieId);
        return ResponseEntity.ok(ApiResponse.success("Xóa bookmark thành công"));
    }

    private void validateOwner(Long userId, CustomUserDetails principal) {
        if (!principal.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Không có quyền truy cập dữ liệu của người dùng khác");
        }
    }
}
