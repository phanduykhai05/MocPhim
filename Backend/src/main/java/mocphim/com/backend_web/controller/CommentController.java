package mocphim.com.backend_web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.request.CreateCommentRequest;
import mocphim.com.backend_web.dto.request.UpdateCommentStatusRequest;
import mocphim.com.backend_web.dto.request.VoteCommentRequest;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.CommentResponse;
import mocphim.com.backend_web.model.Role;
import mocphim.com.backend_web.security.CustomUserDetails;
import mocphim.com.backend_web.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBySlug(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails principal) {
        Long userId = principal != null ? principal.getUser().getId() : null;
        Map<String, Object> data = commentService.getBySlug(slug, page, size, userId);
        long total = ((Number) data.get("total")).longValue();
        int totalPages = size > 0 ? (int) Math.ceil((double) total / size) : 1;
        return ResponseEntity.ok(ApiResponse.success(data,
                new ApiResponse.Pagination(page + 1, Math.max(totalPages, 1), total, size)));
    }

    @PostMapping("/{slug}")
    public ResponseEntity<ApiResponse<CommentResponse>> create(
            @PathVariable String slug,
            @Valid @RequestBody CreateCommentRequest req,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success("Bình luận đã được đăng", commentService.create(slug, req, principal)));
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<ApiResponse<CommentResponse>> vote(
            @PathVariable Long id,
            @Valid @RequestBody VoteCommentRequest req,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success(commentService.vote(id, req, principal.getUser().getId())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        boolean isAdmin = principal.getUser().getRoles().contains(Role.ROLE_ADMIN);
        commentService.delete(id, principal.getUser().getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa bình luận"));
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<?>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        Map<String, Object> result = commentService.getAll(page, size, status);
        long total = ((Number) result.get("total")).longValue();
        int totalPages = size > 0 ? (int) Math.ceil((double) total / size) : 1;
        @SuppressWarnings("unchecked")
        List<?> data = (List<?>) result.get("data");
        return ResponseEntity.ok(ApiResponse.success(data,
                new ApiResponse.Pagination(page + 1, Math.max(totalPages, 1), total, size)));
    }

    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<ApiResponse<CommentResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommentStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success(commentService.updateStatus(id, req)));
    }
}
