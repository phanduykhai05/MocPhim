package mocphim.com.backend_web.dto.response;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * Utility class để xử lý OPhim API response và extract pagination info
 * OPhim API response structure:
 * {
 *   "status": true,
 *   "data": {
 *     "items": [...] hoặc "data": {"items": [...]},
 *     "pagination": {...}
 *   }
 * }
 */
@Slf4j
public class OPhimResponseParser {

    /**
     * Extract pagination từ OPhim response
     * Hỗ trợ cả structure cũ và mới
     */
    public static Object extractItems(Object response) {
        try {
            if (!(response instanceof Map<?, ?> responseMap)) {
                return response;
            }

            Object dataField = responseMap.get("data");

            // Case 1: data là List thẳng → trả về luôn
            if (dataField instanceof List<?>) {
                return dataField;
            }

            // Case 2: data là Map → tìm items bên trong
            if (dataField instanceof Map<?, ?> data) {
                if (data.get("items") instanceof List<?>) {
                    return data.get("items");
                }
                if (data.get("data") instanceof Map<?, ?> innerData &&
                        innerData.get("items") instanceof List<?>) {
                    return innerData.get("items");
                }
                return data;
            }

            return response;
        } catch (Exception e) {
            log.debug("Failed to extract items: {}", e.getMessage());
            return response;
        }
    }

    public static ApiResponse.Pagination extractPagination(Object response) {
        try {
            if (!(response instanceof Map<?, ?> responseMap)) {
                return null;
            }

            Object dataField = responseMap.get("data");

            Map<?, ?> paginationContainer = null;

            // Case 1: pagination nằm ở root level (cùng cấp với data)
            if (responseMap.get("pagination") instanceof Map<?, ?>) {
                paginationContainer = responseMap;
            }
            // Case 2: data là Map chứa pagination
            else if (dataField instanceof Map<?, ?> data) {
                if (data.get("pagination") instanceof Map<?, ?>) {
                    paginationContainer = data;
                } else if (data.get("data") instanceof Map<?, ?> innerData &&
                        innerData.get("pagination") instanceof Map<?, ?>) {
                    paginationContainer = innerData;
                }
            }

            if (paginationContainer == null) return null;

            Map<?, ?> paginationMap = (Map<?, ?>) paginationContainer.get("pagination");
            if (paginationMap == null) return null;

            int currentPage = toInt(paginationMap.get("currentPage"));
            int totalPages  = toInt(paginationMap.get("totalPages"));
            long totalItems = toLong(paginationMap.get("totalItems"));
            int itemsPerPage = toInt(paginationMap.get("itemsPerPage")) > 0
                    ? toInt(paginationMap.get("itemsPerPage"))
                    : toInt(paginationMap.get("totalItemsPerPage"));

            // Nếu tất cả đều 0 → không có pagination thực sự
            if (currentPage == 0 && totalPages == 0 && totalItems == 0) return null;

            return new ApiResponse.Pagination(currentPage, totalPages, totalItems, itemsPerPage);
        } catch (Exception e) {
            log.debug("Failed to extract pagination: {}", e.getMessage());
            return null;
        }
    }
    private static int toInt(Object value) {
        if (value instanceof Number n) return n.intValue();
        if (value instanceof String s) {
            try { return Integer.parseInt(s); } catch (Exception e) { return 0; }
        }
        return 0;
    }

    private static long toLong(Object value) {
        if (value instanceof Number n) return n.longValue();
        if (value instanceof String s) {
            try { return Long.parseLong(s); } catch (Exception e) { return 0L; }
        }
        return 0L;
    }
    /**
     * Tự tính pagination từ List
     */
    public static ApiResponse.Pagination paginateList(List<?> items, int page, int size) {
        if (items == null || items.isEmpty()) {
            return new ApiResponse.Pagination(page, 0, 0, size);
        }
        long totalItems = items.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        return new ApiResponse.Pagination(page, totalPages, totalItems, size);
    }

    /**
     * Cắt List theo page/size
     */
    public static List<?> sliceList(List<?> items, int page, int size) {
        if (items == null || items.isEmpty()) return List.of();
        int fromIndex = Math.min((page - 1) * size, items.size());
        int toIndex   = Math.min(fromIndex + size, items.size());
        return items.subList(fromIndex, toIndex);
    }
}


