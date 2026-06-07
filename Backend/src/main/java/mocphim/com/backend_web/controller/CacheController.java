package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/admin/cache")
@RequiredArgsConstructor
public class CacheController {

    private final CacheManager cacheManager;

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> flushAll() {
        cacheManager.getCacheNames().forEach(name ->
                Objects.requireNonNull(cacheManager.getCache(name)).clear());
        return ResponseEntity.ok(ApiResponse.success("Đã xóa toàn bộ cache"));
    }

    @DeleteMapping("/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> flushByName(@PathVariable String name) {
        var cache = cacheManager.getCache(name);
        if (cache == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cache '" + name + "' không tồn tại"));
        }
        cache.clear();
        return ResponseEntity.ok(ApiResponse.success("Đã xóa cache: " + name));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Collection<String>>> listCaches() {
        return ResponseEntity.ok(ApiResponse.success(cacheManager.getCacheNames()));
    }
}
