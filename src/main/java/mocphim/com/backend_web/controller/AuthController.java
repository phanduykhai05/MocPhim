package mocphim.com.backend_web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.request.LoginRequest;
import mocphim.com.backend_web.dto.request.RegisterRequest;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.TokenResponse;
import mocphim.com.backend_web.dto.response.UserResponse;
import mocphim.com.backend_web.security.CustomUserDetails;
import mocphim.com.backend_web.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<TokenResponse>> register(@Valid @RequestBody RegisterRequest request) {
        TokenResponse token = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", token));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse token = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", token));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(@RequestBody Map<String, String> body) {
        TokenResponse token = authService.refreshToken(body.get("refreshToken"));
        return ResponseEntity.ok(ApiResponse.success(token));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse user = authService.getCurrentUser(userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công"));
    }
}
