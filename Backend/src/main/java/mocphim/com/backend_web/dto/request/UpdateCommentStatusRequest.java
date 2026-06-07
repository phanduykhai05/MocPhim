package mocphim.com.backend_web.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateCommentStatusRequest {

    @Pattern(regexp = "pending|approved|spam", message = "status phải là 'pending', 'approved' hoặc 'spam'")
    private String status;
}
