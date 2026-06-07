package mocphim.com.backend_web.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
@Data
@NoArgsConstructor
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String keyword;

    @Column(name = "search_count")
    private Long searchCount = 1L;

    @Column(name = "last_searched_at")
    private LocalDateTime lastSearchedAt;

    public SearchHistory(String keyword) {
        this.keyword = keyword;
        this.searchCount = 1L;
        this.lastSearchedAt = LocalDateTime.now();
    }
}
