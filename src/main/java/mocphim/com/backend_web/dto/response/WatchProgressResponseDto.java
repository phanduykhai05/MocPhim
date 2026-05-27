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
public class WatchProgressResponseDto {
    private Long userId;
    private String movieId;
    private String slug;
    private int episodeNumber;
    private long positionSeconds;
    private boolean isCompleted;
    private LocalDateTime lastWatchedAt;
}
