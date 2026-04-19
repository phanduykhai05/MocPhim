package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.service.CountryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getCountries() {
        return ResponseEntity.ok(ApiResponse.success(countryService.getCountries()));
    }

    @GetMapping("/{slug}/movies")
    public ResponseEntity<ApiResponse<Object>> getCountryMovies(
        @PathVariable String slug,
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(name = "sort_field", required = false) String sortField,
        @RequestParam(name = "sort_type", required = false) String sortType
    ) {
        Map<String, String> params = new HashMap<>();
        params.put("page", String.valueOf(page));
        if (sortField != null) params.put("sort_field", sortField);
        if (sortType != null)  params.put("sort_type", sortType);
        return ResponseEntity.ok(ApiResponse.success(countryService.getCountryMovies(slug, params)));
    }
}
