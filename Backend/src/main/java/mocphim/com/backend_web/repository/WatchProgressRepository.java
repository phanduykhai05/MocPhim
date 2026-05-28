package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.entity.WatchProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchProgressRepository extends JpaRepository<WatchProgress, Long> {
    Optional<WatchProgress> findByUserIdAndMovieIdAndEpisodeNumber(Long userId, String movieId, int episodeNumber);
    List<WatchProgress> findByUserIdAndMovieId(Long userId, String movieId);
    List<WatchProgress> findByUserIdAndMovieIdIn(Long userId, List<String> movieIds);
}
