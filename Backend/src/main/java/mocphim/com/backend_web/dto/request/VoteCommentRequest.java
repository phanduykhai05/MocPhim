package mocphim.com.backend_web.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VoteCommentRequest {

    @Pattern(regexp = "up|down", message = "voteType phải là 'up' hoặc 'down'")
    private String voteType;
}
