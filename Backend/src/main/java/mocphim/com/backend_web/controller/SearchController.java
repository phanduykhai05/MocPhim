package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.OPhimResponseParser;
import mocphim.com.backend_web.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(name = "sort_field", required = false) String sortField,
            @RequestParam(name = "sort_type", required = false) String sortType
    ) {
        int safeSize = Math.min(Math.max(size, 1), 100);
        Map<String, String> params = new HashMap<>();
        params.put("page", String.valueOf(page));
        params.put("limit", String.valueOf(safeSize));
        if (sortField != null) params.put("sort_field", sortField);
        if (sortType != null)  params.put("sort_type", sortType);

        Object response = searchService.search(keyword, params);
        Object items = OPhimResponseParser.extractItems(response);

        // Thử lấy pagination từ OPhim trước
        ApiResponse.Pagination pagination = OPhimResponseParser.extractPagination(response);

        // Nếu OPhim không trả pagination → tự tính
        if (pagination == null && items instanceof List<?> list) {
            pagination = OPhimResponseParser.paginateList(list, page, safeSize);
            items = OPhimResponseParser.sliceList(list, page, safeSize);
        }

        return ResponseEntity.ok(ApiResponse.success(items, pagination));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Object>> searchAll(
        @RequestParam String keyword,
        @RequestParam(name = "sort_field", required = false) String sortField,
        @RequestParam(name = "sort_type", required = false) String sortType
    ) {
        Map<String, String> params = new HashMap<>();
        params.put("page", "1");
        params.put("limit", "500");
        if (sortField != null) params.put("sort_field", sortField);
        if (sortType != null)  params.put("sort_type", sortType);
        Object response = searchService.search(keyword, params);
        Object items = OPhimResponseParser.extractItems(response);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Object>> getSearchHistory(
        @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(ApiResponse.success(searchService.getHistory(limit)));
    }
}
