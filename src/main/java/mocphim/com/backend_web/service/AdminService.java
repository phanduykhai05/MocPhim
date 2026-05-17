package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.UserResponse;
import mocphim.com.backend_web.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AuthService authService;

    public Page<UserResponse> getAllUsers(int page, int size) {
        Page<mocphim.com.backend_web.model.User> users = userRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return users.map(authService::toUserResponse);
    }
}
