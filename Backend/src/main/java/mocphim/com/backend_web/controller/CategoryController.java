package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.OPhimResponseParser;
import mocphim.com.backend_web.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getCategories()));
    }
    @GetMapping("/{slug}/movies")
    public ResponseEntity<ApiResponse<Object>> getCategoryMovies(
            @PathVariable String slug,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(name = "sort_field", required = false) String sortField,
            @RequestParam(name = "sort_type", required = false) String sortType
    ) {
        int safeSize = Math.min(Math.max(size, 1), 100);
        Map<String, String> params = new HashMap<>();
        params.put("limit", "500");
        if (sortField != null) params.put("sort_field", sortField);
        if (sortType != null)  params.put("sort_type", sortType);

        Object response = categoryService.getCategoryMovies(slug, params);
        List<?> allItems = (List<?>) OPhimResponseParser.extractItems(response);
        ApiResponse.Pagination pagination = OPhimResponseParser.paginateList(allItems, page, safeSize);
        List<?> pageItems = OPhimResponseParser.sliceList(allItems, page, safeSize);
        return ResponseEntity.ok(ApiResponse.success(pageItems, pagination));
    }

    @GetMapping("/{slug}/movies/all")
    public ResponseEntity<ApiResponse<Object>> getCategoryMoviesAll(
        @PathVariable String slug,
        @RequestParam(name = "sort_field", required = false) String sortField,
        @RequestParam(name = "sort_type", required = false) String sortType
    ) {
        Map<String, String> params = new HashMap<>();
        params.put("page", "1");
        params.put("limit", "500");
        if (sortField != null) params.put("sort_field", sortField);
        if (sortType != null)  params.put("sort_type", sortType);
        Object response = categoryService.getCategoryMovies(slug, params);
        Object items = OPhimResponseParser.extractItems(response);
        return ResponseEntity.ok(ApiResponse.success(items));
    }
}
