package mocphim.com.backend_web.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.entity.MovieViewCount;
import mocphim.com.backend_web.security.CustomUserDetails;
import mocphim.com.backend_web.service.MovieViewCountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/views")
@RequiredArgsConstructor
public class MovieViewController {

    private final MovieViewCountService viewCountService;

    @GetMapping("/stats/today")
    public ResponseEntity<ApiResponse<Map<String, Long>>> todayTotal() {
        return ResponseEntity.ok(ApiResponse.success(Map.of("total", viewCountService.getTodayTotal())));
    }

    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<MovieViewCount>>> getTopViewed(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(viewCountService.getTopViewed(limit)));
    }

    @GetMapping("/batch")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getBatch(
            @RequestParam String slugs) {
        List<String> slugList = Arrays.stream(slugs.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(viewCountService.getBatch(slugList)));
    }

    @PostMapping("/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Long>>> increment(
            @PathVariable String slug,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        String viewerKey = principal != null
                ? "u:" + principal.getUser().getId()
                : "ip:" + getClientIp(request);
        return ResponseEntity.ok(ApiResponse.success(viewCountService.increment(slug, viewerKey)));
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getCount(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(viewCountService.getCount(slug)));
    }
}
