package mocphim.com.backend_web.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @NotBlank(message = "Email không được trống")
    @Email(message = "Email không đúng định dạng")
    private String email;
}
