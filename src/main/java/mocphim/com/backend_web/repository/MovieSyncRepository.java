package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.entity.MovieSync;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieSyncRepository extends JpaRepository<MovieSync, Long> {
    boolean existsBySlug(String slug);
}
