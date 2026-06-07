package mocphim.com.backend_web.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentResponse {

    private Long id;
    private String movieSlug;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String content;
    private boolean isSpoiler;
    private Long parentId;
    private int upvotes;
    private int downvotes;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // populated when fetching top-level comments
    private List<CommentResponse> replies;
    private String userVote; // "up", "down", or null
}
