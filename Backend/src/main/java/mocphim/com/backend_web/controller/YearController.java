package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.OPhimResponseParser;
import mocphim.com.backend_web.service.YearService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/years")
@RequiredArgsConstructor
public class YearController {

    private final YearService yearService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getYears() {
        return ResponseEntity.ok(ApiResponse.success(yearService.getYears()));
    }
    @GetMapping("/{year}/movies")
    public ResponseEntity<ApiResponse<Object>> getYearMovies(
            @PathVariable int year,
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

        Object response = yearService.getYearMovies(year, params);
        List<?> allItems = (List<?>) OPhimResponseParser.extractItems(response);
        ApiResponse.Pagination pagination = OPhimResponseParser.paginateList(allItems, page, safeSize);
        List<?> pageItems = OPhimResponseParser.sliceList(allItems, page, safeSize);
        return ResponseEntity.ok(ApiResponse.success(pageItems, pagination));
    }

    @GetMapping("/{year}/movies/all")
    public ResponseEntity<ApiResponse<Object>> getYearMoviesAll(
        @PathVariable int year,
        @RequestParam(name = "sort_field", required = false) String sortField,
        @RequestParam(name = "sort_type", required = false) String sortType
    ) {
        Map<String, String> params = new HashMap<>();
        params.put("page", "1");
        params.put("limit", "500");
        if (sortField != null) params.put("sort_field", sortField);
        if (sortType != null)  params.put("sort_type", sortType);
        Object response = yearService.getYearMovies(year, params);
        Object items = OPhimResponseParser.extractItems(response);
        return ResponseEntity.ok(ApiResponse.success(items));
    }
}
