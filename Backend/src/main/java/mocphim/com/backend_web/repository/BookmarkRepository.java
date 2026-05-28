package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserIdOrderByBookmarkDateDesc(Long userId);
    boolean existsByUserIdAndMovieId(Long userId, String movieId);
    void deleteByUserIdAndMovieId(Long userId, String movieId);
    Optional<Bookmark> findByUserIdAndMovieId(Long userId, String movieId);
}
