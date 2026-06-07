package mocphim.com.backend_web.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookmarkRequestDto {

    @NotBlank(message = "slug không được trống")
    private String slug;
}
