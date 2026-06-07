package mocphim.com.backend_web.dto.request;

import lombok.Data;

@Data
public class BookmarkProgressRequestDto {
    private Boolean isWatched;
    private Integer watchingProgress;
}
