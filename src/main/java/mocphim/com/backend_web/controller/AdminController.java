package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.UserResponse;
import mocphim.com.backend_web.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<UserResponse> result = adminService.getAllUsers(page, size);
        ApiResponse.Pagination pagination = new ApiResponse.Pagination(
                result.getNumber() + 1,
                result.getTotalPages(),
                result.getTotalElements(),
                result.getSize());
        return ResponseEntity.ok(ApiResponse.success(result.getContent(), pagination));
    }
}
