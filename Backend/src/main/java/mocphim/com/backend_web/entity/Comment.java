package mocphim.com.backend_web.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments", indexes = {
        @Index(name = "idx_comments_movie_slug", columnList = "movie_slug")
})
@Data
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "movie_slug", nullable = false)
    private String movieSlug;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_avatar")
    private String userAvatar;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "is_spoiler", nullable = false)
    private boolean isSpoiler = false;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(nullable = false)
    private int upvotes = 0;

    @Column(nullable = false)
    private int downvotes = 0;

    // pending / approved / spam
    @Column(nullable = false)
    private String status = "approved";

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
