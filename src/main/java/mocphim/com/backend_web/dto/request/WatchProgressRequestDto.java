package mocphim.com.backend_web.dto.request;

import lombok.Data;

@Data
public class WatchProgressRequestDto {
    private String slug;           // bắt buộc lần đầu upsert
    private Long positionSeconds;
    private Boolean isCompleted;
}
