package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.service.YearService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
        @RequestParam(name = "sort_field", required = false) String sortField,
        @RequestParam(name = "sort_type", required = false) String sortType
    ) {
        Map<String, String> params = new HashMap<>();
        params.put("page", String.valueOf(page));
        if (sortField != null) params.put("sort_field", sortField);
        if (sortType != null)  params.put("sort_type", sortType);
        return ResponseEntity.ok(ApiResponse.success(yearService.getYearMovies(year, params)));
    }
}
