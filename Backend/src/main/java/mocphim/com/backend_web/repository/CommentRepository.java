package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByMovieSlugAndStatusAndParentIdIsNull(String movieSlug, String status, Pageable pageable);

    List<Comment> findByParentIdAndStatus(Long parentId, String status, org.springframework.data.domain.Sort sort);

    Page<Comment> findByStatus(String status, Pageable pageable);

    Page<Comment> findAll(Pageable pageable);
}
