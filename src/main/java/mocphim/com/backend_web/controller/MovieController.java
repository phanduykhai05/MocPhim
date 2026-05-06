package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.OPhimResponseParser;
import mocphim.com.backend_web.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getMovieList(
        @RequestParam String list,
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "20") Integer size,
        @RequestParam(name = "sort_field", required = false) String sortField,
        @RequestParam(name = "sort_type", required = false) String sortType,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String country,
        @RequestParam(required = false) Integer year,
        @RequestParam(required = false) String type
    ) {
        // Validate size limit (max 100)
        int safeSize = Math.min(Math.max(size, 1), 100);
        Map<String, String> params = buildParams(page, safeSize, sortField, sortType, category, country, year, type);
        Object response = movieService.getMovieList(list, params);
        Object items = OPhimResponseParser.extractItems(response);
        ApiResponse.Pagination pagination = OPhimResponseParser.extractPagination(response);
        return ResponseEntity.ok(ApiResponse.success(items, pagination));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Object>> getMovieListAll(
        @RequestParam String list,
        @RequestParam(name = "sort_field", required = false) String sortField,
        @RequestParam(name = "sort_type", required = false) String sortType,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String country,
        @RequestParam(required = false) Integer year,
        @RequestParam(required = false) String type
    ) {
        Map<String, String> params = buildParams(1, 500, sortField, sortType, category, country, year, type);
        Object response = movieService.getMovieList(list, params);
        Object items = OPhimResponseParser.extractItems(response);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/{slug}")

    public ResponseEntity<ApiResponse<Object>> getMovieDetail(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(movieService.getMovieDetail(slug)));
    }

    @GetMapping("/{slug}/images")
    public ResponseEntity<ApiResponse<Object>> getMovieImages(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(movieService.getMovieImages(slug)));
    }

    @GetMapping("/{slug}/peoples")
    public ResponseEntity<ApiResponse<Object>> getMoviePeoples(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(movieService.getMoviePeoples(slug)));
    }

    @GetMapping("/{slug}/keywords")
    public ResponseEntity<ApiResponse<Object>> getMovieKeywords(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(movieService.getMovieKeywords(slug)));
    }

    private Map<String, String> buildParams(Integer page, Integer size, String sortField, String sortType,
                                             String category, String country, Integer year, String type) {
        Map<String, String> params = new HashMap<>();
        if (page != null)      params.put("page", String.valueOf(page));
        if (size != null)      params.put("limit", String.valueOf(size));
        if (sortField != null) params.put("sort_field", sortField);
        if (sortType != null)  params.put("sort_type", sortType);
        if (category != null)  params.put("category", category);
        if (country != null)   params.put("country", country);
        if (year != null)      params.put("year", String.valueOf(year));
        if (type != null)      params.put("type", type);
        return params;
    }
}
