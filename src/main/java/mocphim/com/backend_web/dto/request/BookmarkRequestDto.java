package mocphim.com.backend_web.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookmarkRequestDto {

    @NotNull(message = "userId không được trống")
    private Long userId;

    @NotBlank(message = "movieId không được trống")
    private String movieId;

    @NotBlank(message = "slug không được trống")
    private String slug;

    private String movieTitle;
    private String posterUrl;
    private String mediaType;
}
