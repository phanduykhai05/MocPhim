package mocphim.com.backend_web.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookmarks", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "movie_id"})
})
@Data
@NoArgsConstructor
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "movie_id", nullable = false)
    private String movieId;

    @Column(nullable = false)
    private String slug;

    @Column(name = "movie_title")
    private String movieTitle;

    @Column(name = "poster_url")
    private String posterUrl;

    @Column(name = "media_type")
    private String mediaType;

    @Column(name = "bookmark_date", nullable = false)
    private LocalDateTime bookmarkDate;
}
