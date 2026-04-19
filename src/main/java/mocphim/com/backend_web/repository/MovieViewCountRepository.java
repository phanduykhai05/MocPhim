package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.entity.MovieViewCount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieViewCountRepository extends JpaRepository<MovieViewCount, Long> {
    Optional<MovieViewCount> findBySlug(String slug);
}
