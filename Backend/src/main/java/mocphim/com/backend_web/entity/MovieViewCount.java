package mocphim.com.backend_web.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "movie_view_count")
@Data
@NoArgsConstructor
public class MovieViewCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(name = "view_count")
    private Long viewCount = 0L;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
