package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.request.CreateCommentRequest;
import mocphim.com.backend_web.dto.request.UpdateCommentStatusRequest;
import mocphim.com.backend_web.dto.request.VoteCommentRequest;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.dto.response.CommentResponse;
import mocphim.com.backend_web.entity.Comment;
import mocphim.com.backend_web.entity.CommentVote;
import mocphim.com.backend_web.repository.CommentRepository;
import mocphim.com.backend_web.repository.CommentVoteRepository;
import mocphim.com.backend_web.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentVoteRepository commentVoteRepository;

    public Map<String, Object> getBySlug(String slug, int page, int size, Long userId) {
        Page<Comment> commentPage = commentRepository.findByMovieSlugAndStatusAndParentIdIsNull(
                slug, "approved",
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        List<Long> commentIds = commentPage.getContent().stream().map(Comment::getId).toList();

        // batch-load votes for this user
        Map<Long, String> voteMap = userId != null
                ? commentVoteRepository.findByCommentIdInAndUserId(commentIds, userId).stream()
                        .collect(Collectors.toMap(CommentVote::getCommentId, CommentVote::getVoteType))
                : Map.of();

        List<CommentResponse> enriched = commentPage.getContent().stream()
                .map(c -> {
                    CommentResponse resp = toResponse(c);
                    resp.setUserVote(voteMap.get(c.getId()));

                    List<Comment> rawReplies = commentRepository.findByParentIdAndStatus(
                            c.getId(), "approved",
                            Sort.by(Sort.Direction.ASC, "createdAt"));
                    // take first 5 replies
                    List<CommentResponse> replies = rawReplies.stream()
                            .limit(5)
                            .map(this::toResponse)
                            .toList();
                    resp.setReplies(replies);
                    return resp;
                }).toList();

        return Map.of(
                "comments", enriched,
                "total", commentPage.getTotalElements(),
                "page", page,
                "size", size
        );
    }

    @Transactional
    public CommentResponse create(String slug, CreateCommentRequest req, CustomUserDetails principal) {
        Comment comment = new Comment();
        comment.setMovieSlug(slug);
        comment.setUserId(principal.getUser().getId());
        comment.setUserName(principal.getUser().getName());
        comment.setUserAvatar(principal.getUser().getAvatar());
        comment.setContent(req.getContent());
        comment.setSpoiler(req.getIsSpoiler() != null && req.getIsSpoiler());
        comment.setParentId(req.getParentId());
        comment.setStatus("approved");
        return toResponse(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponse vote(Long commentId, VoteCommentRequest req, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bình luận"));

        Optional<CommentVote> existing = commentVoteRepository.findByCommentIdAndUserId(commentId, userId);

        if (existing.isPresent()) {
            CommentVote vote = existing.get();
            if (vote.getVoteType().equals(req.getVoteType())) {
                // undo vote
                if ("up".equals(req.getVoteType())) comment.setUpvotes(Math.max(0, comment.getUpvotes() - 1));
                else comment.setDownvotes(Math.max(0, comment.getDownvotes() - 1));
                commentVoteRepository.delete(vote);
                Comment saved = commentRepository.save(comment);
                CommentResponse resp = toResponse(saved);
                resp.setUserVote(null);
                return resp;
            }
            // switch vote
            if ("up".equals(vote.getVoteType())) {
                comment.setUpvotes(Math.max(0, comment.getUpvotes() - 1));
                comment.setDownvotes(comment.getDownvotes() + 1);
            } else {
                comment.setDownvotes(Math.max(0, comment.getDownvotes() - 1));
                comment.setUpvotes(comment.getUpvotes() + 1);
            }
            vote.setVoteType(req.getVoteType());
            commentVoteRepository.save(vote);
        } else {
            CommentVote newVote = new CommentVote();
            newVote.setCommentId(commentId);
            newVote.setUserId(userId);
            newVote.setVoteType(req.getVoteType());
            commentVoteRepository.save(newVote);
            if ("up".equals(req.getVoteType())) comment.setUpvotes(comment.getUpvotes() + 1);
            else comment.setDownvotes(comment.getDownvotes() + 1);
        }

        Comment saved = commentRepository.save(comment);
        CommentResponse resp = toResponse(saved);
        resp.setUserVote(req.getVoteType());
        return resp;
    }

    @Transactional
    public void delete(Long commentId, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bình luận"));
        if (!isAdmin && !comment.getUserId().equals(userId)) {
            throw new AccessDeniedException("Không có quyền xóa bình luận này");
        }
        commentRepository.delete(comment);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    public Map<String, Object> getAll(int page, int size, String status) {
        Page<Comment> result = (status != null && !status.isBlank())
                ? commentRepository.findByStatus(status, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                : commentRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        return Map.of(
                "data", result.getContent().stream().map(this::toResponse).toList(),
                "total", result.getTotalElements(),
                "page", page,
                "size", size
        );
    }

    @Transactional
    public CommentResponse updateStatus(Long commentId, UpdateCommentStatusRequest req) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bình luận"));
        comment.setStatus(req.getStatus());
        return toResponse(commentRepository.save(comment));
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────

    private CommentResponse toResponse(Comment c) {
        CommentResponse r = new CommentResponse();
        r.setId(c.getId());
        r.setMovieSlug(c.getMovieSlug());
        r.setUserId(c.getUserId());
        r.setUserName(c.getUserName());
        r.setUserAvatar(c.getUserAvatar());
        r.setContent(c.getContent());
        r.setSpoiler(c.isSpoiler());
        r.setParentId(c.getParentId());
        r.setUpvotes(c.getUpvotes());
        r.setDownvotes(c.getDownvotes());
        r.setStatus(c.getStatus());
        r.setCreatedAt(c.getCreatedAt());
        r.setUpdatedAt(c.getUpdatedAt());
        return r;
    }
}
