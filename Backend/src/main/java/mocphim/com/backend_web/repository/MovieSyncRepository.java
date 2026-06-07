package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.entity.MovieSync;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieSyncRepository extends JpaRepository<MovieSync, Long> {
    boolean existsBySlug(String slug);
    Optional<MovieSync> findBySlug(String slug);
    Page<MovieSync> findByOphimIdIsNull(Pageable pageable);
    long countByOphimIdIsNull();
}
