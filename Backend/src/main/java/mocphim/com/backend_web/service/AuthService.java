package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.request.LoginRequest;
import mocphim.com.backend_web.dto.request.RegisterRequest;
import mocphim.com.backend_web.dto.response.TokenResponse;
import mocphim.com.backend_web.dto.response.UserResponse;
import mocphim.com.backend_web.model.Role;
import mocphim.com.backend_web.model.User;
import mocphim.com.backend_web.repository.UserRepository;
import mocphim.com.backend_web.security.CustomUserDetails;
import mocphim.com.backend_web.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RestTemplate restTemplate;

    @Value("${app.jwt.access-expiration}")
    private long accessExpiration;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setProvider("local");
        user.setRoles(new HashSet<>(Set.of(Role.ROLE_USER)));
        userRepository.save(user);
        return buildTokenResponse(user);
    }

    public TokenResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return buildTokenResponse(userDetails.getUser());
    }

    public TokenResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Refresh token không hợp lệ");
        }
        Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));
        return TokenResponse.builder()
                .accessToken(jwtTokenProvider.generateAccessToken(user))
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessExpiration)
                .build();
    }

    @SuppressWarnings("unchecked")
    public TokenResponse loginWithGoogle(String idToken) {
        if (!StringUtils.hasText(idToken)) {
            throw new IllegalArgumentException("ID token không được trống");
        }
        Map<String, Object> googleUser;
        try {
            googleUser = restTemplate.getForObject(
                    "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken, Map.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Google ID token không hợp lệ hoặc đã hết hạn");
        }
        if (googleUser == null || !googleClientId.equals(googleUser.get("aud"))) {
            throw new IllegalArgumentException("Google ID token không hợp lệ");
        }

        String email = (String) googleUser.get("email");
        String name = (String) googleUser.get("name");
        String avatar = (String) googleUser.get("picture");
        String providerId = (String) googleUser.get("sub");

        User user = userRepository.findByEmail(email).map(existing -> {
            if ("local".equals(existing.getProvider())) {
                throw new IllegalArgumentException("Email đã đăng ký bằng email/password, vui lòng đăng nhập thông thường");
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

        return buildTokenResponse(user);
    }

    @Cacheable(value = "users", key = "#userId")
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));
        return toUserResponse(user);
    }

    private TokenResponse buildTokenResponse(User user) {
        return TokenResponse.builder()
                .accessToken(jwtTokenProvider.generateAccessToken(user))
                .refreshToken(jwtTokenProvider.generateRefreshToken(user))
                .tokenType("Bearer")
                .expiresIn(accessExpiration)
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .avatar(user.getAvatar())
                .provider(user.getProvider())
                .roles(user.getRoles().stream().map(Role::name).collect(Collectors.toSet()))
                .build();
    }
}
