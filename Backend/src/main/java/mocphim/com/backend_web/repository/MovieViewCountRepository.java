package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.entity.MovieViewCount;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieViewCountRepository extends JpaRepository<MovieViewCount, Long> {

    Optional<MovieViewCount> findBySlug(String slug);

    List<MovieViewCount> findBySlugIn(List<String> slugs);

    List<MovieViewCount> findAllByOrderByViewCountDesc(Pageable pageable);

    @Query("SELECT COALESCE(SUM(v.viewCountToday), 0) FROM MovieViewCount v WHERE v.lastResetDate = :today")
    Long sumViewCountToday(@Param("today") String today);
}
