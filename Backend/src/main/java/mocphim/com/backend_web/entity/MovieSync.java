package mocphim.com.backend_web.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "movie_sync")
@Data
@NoArgsConstructor
public class MovieSync {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String slug;

    private String title;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public MovieSync(String slug, String title) {
        this.slug = slug;
        this.title = title;
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = LocalDateTime.now();
    }
}
