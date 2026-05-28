package mocphim.com.backend_web.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class WatchProgressRequestDto {
    private String slug;           // bắt buộc lần đầu upsert
    private Long positionSeconds;
    @JsonProperty("isCompleted")
    private Boolean isCompleted;
}
