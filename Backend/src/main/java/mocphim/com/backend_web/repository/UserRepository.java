package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByVerifyToken(String token);
    Optional<User> findByResetToken(String token);
    Optional<User> findByEmailAndIsVerifiedTrue(String email);
}
