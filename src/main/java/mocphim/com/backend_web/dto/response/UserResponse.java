package mocphim.com.backend_web.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String avatar;
    private String provider;
    private Set<String> roles;
}
