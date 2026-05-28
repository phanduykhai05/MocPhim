package mocphim.com.backend_web.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "watch_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "movie_id", "episode_number"})
})
@Data
@NoArgsConstructor
public class WatchProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "movie_id", nullable = false)
    private String movieId;

    @Column(nullable = false)
    private String slug;

    @Column(name = "episode_number", nullable = false)
    private int episodeNumber = 1;

    @Column(name = "position_seconds", nullable = false)
    private long positionSeconds = 0;

    @Column(name = "is_completed", nullable = false, columnDefinition = "boolean not null default false")
    private boolean isCompleted = false;

    @Column(name = "last_watched_at", nullable = false)
    private LocalDateTime lastWatchedAt;
}
