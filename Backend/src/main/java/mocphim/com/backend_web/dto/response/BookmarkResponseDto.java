package mocphim.com.backend_web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkResponseDto {
    private Long id;
    private Long userId;
    private String movieId;
    private String slug;
    private String movieTitle;
    private String posterUrl;
    private String mediaType;
    private LocalDateTime bookmarkDate;
    // từ watch_progress — null nếu chưa xem lần nào
    private Integer latestEpisode;
    private Long positionSeconds;
    private Boolean episodeCompleted;
    private LocalDateTime lastWatchedAt;
}
