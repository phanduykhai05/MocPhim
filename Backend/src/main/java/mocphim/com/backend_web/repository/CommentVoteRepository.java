package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.entity.CommentVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentVoteRepository extends JpaRepository<CommentVote, Long> {

    Optional<CommentVote> findByCommentIdAndUserId(Long commentId, Long userId);

    List<CommentVote> findByCommentIdInAndUserId(List<Long> commentIds, Long userId);
}
