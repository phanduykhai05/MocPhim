package mocphim.com.backend_web.security.oauth2;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.model.Role;
import mocphim.com.backend_web.model.User;
import mocphim.com.backend_web.repository.UserRepository;
import mocphim.com.backend_web.security.CustomUserDetails;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends OidcUserService {

    private final UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        Map<String, Object> attributes = oidcUser.getAttributes();

        String providerId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String avatar = (String) attributes.get("picture");

        User user = userRepository.findByEmail(email).map(existing -> {
            if ("local".equals(existing.getProvider())) {
                throw new OAuth2AuthenticationException(
                        new OAuth2Error("email_conflict"),
                        "Email đã đăng ký bằng email/password, vui lòng đăng nhập thông thường");
            }
            existing.setName(name);
            existing.setAvatar(avatar);
            return userRepository.save(existing);
        }).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setAvatar(avatar);
            newUser.setProvider("google");
            newUser.setProviderId(providerId);
            newUser.setRoles(new HashSet<>(Set.of(Role.ROLE_USER)));
            return userRepository.save(newUser);
        });

        return new CustomUserDetails(user, oidcUser);
    }
}
