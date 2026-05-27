package mocphim.com.backend_web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.request.BookmarkRequestDto;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.BookmarkResponseDto;
import mocphim.com.backend_web.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<BookmarkResponseDto>>> getBookmarks(
            @PathVariable Long userId) {
        List<BookmarkResponseDto> bookmarks = bookmarkService.getBookmarksByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(bookmarks));
    }

    @GetMapping("/isBookmarked/{userId}/{movieId}")
    public ResponseEntity<ApiResponse<Boolean>> isBookmarked(
            @PathVariable Long userId,
            @PathVariable String movieId) {
        boolean result = bookmarkService.isBookmarked(userId, movieId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookmarkResponseDto>> addBookmark(
            @Valid @RequestBody BookmarkRequestDto request) {
        BookmarkResponseDto response = bookmarkService.addBookmark(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{userId}/{movieId}")
    public ResponseEntity<ApiResponse<String>> deleteBookmark(
            @PathVariable Long userId,
            @PathVariable String movieId) {
        bookmarkService.deleteBookmark(userId, movieId);
        return ResponseEntity.ok(ApiResponse.success("Xóa bookmark thành công"));
    }
}
