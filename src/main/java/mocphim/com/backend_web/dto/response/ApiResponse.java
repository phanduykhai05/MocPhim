package mocphim.com.backend_web.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean status;
    private String message;
    private T data;
    private Pagination pagination;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "success", data, null);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    public static <T> ApiResponse<T> success(T data, Pagination pagination) {
        return new ApiResponse<>(true, "success", data, pagination);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Pagination {
        private int currentPage;
        private int totalPages;
        private long totalItems;
        private int itemsPerPage;
    }
}
