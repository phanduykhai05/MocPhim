package mocphim.com.backend_web.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCommentRequest {

    @NotBlank
    @Size(max = 1000)
    private String content;

    private Boolean isSpoiler = false;

    private Long parentId;
}
