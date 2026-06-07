package mocphim.com.backend_web.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * OPhim API response structure
 * Example:
 * {
 *   "status": true,
 *   "data": {
 *     "items": [...],
 *     "pagination": {
 *       "currentPage": 1,
 *       "totalPages": 10,
 *       "totalItems": 150
 *     }
 *   }
 * }
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OPhimResponse {

    private boolean status;
    private OPhimData data;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OPhimData {
        private List<Map<String, Object>> items;
        private OPhimPagination pagination;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OPhimPagination {
        @JsonProperty("currentPage")
        private int currentPage;

        @JsonProperty("totalPages")
        private int totalPages;

        @JsonProperty("totalItems")
        private long totalItems;

        @JsonProperty("itemsPerPage")
        private int itemsPerPage;
    }
}

