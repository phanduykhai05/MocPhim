package mocphim.com.backend_web.entity;

import com.fasterxml.jackson.annotation.JsonRawValue;
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

    @Column(name = "origin_name")
    private String originName;

    @Column(name = "alternative_names", columnDefinition = "TEXT")
    @JsonRawValue
    private String alternativeNames;

    private String type;

    @Column(name = "thumb_url")
    private String thumbUrl;

    @Column(name = "sub_docquyen")
    private Boolean subDocquyen;

    private String duration;

    @Column(name = "episode_current")
    private String episodeCurrent;

    private String quality;

    private String lang;

    private Integer year;

    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String category;

    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String country;

    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String tmdb;

    @JsonRawValue
    @Column(columnDefinition = "TEXT")
    private String imdb;

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
