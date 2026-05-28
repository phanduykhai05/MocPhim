package mocphim.com.backend_web.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mocphim.com.backend_web.dto.request.WatchProgressRequestDto;
import mocphim.com.backend_web.dto.response.WatchProgressResponseDto;
import mocphim.com.backend_web.entity.WatchProgress;
import mocphim.com.backend_web.repository.WatchProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import redis.clients.jedis.UnifiedJedis;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WatchProgressService {

    private final WatchProgressRepository watchProgressRepository;
    private final UnifiedJedis jedis;
    private final ObjectMapper objectMapper;

    private static final int REDIS_TTL_SECONDS = 7200; // 2 giờ

    @Transactional
    public WatchProgressResponseDto updateProgress(Long userId, String movieId, int episodeNumber,
                                                   WatchProgressRequestDto request) {
        WatchProgress wp = watchProgressRepository
                .findByUserIdAndMovieIdAndEpisodeNumber(userId, movieId, episodeNumber)
                .orElseGet(() -> {
                    if (request.getSlug() == null || request.getSlug().isBlank()) {
                        throw new IllegalArgumentException("slug bắt buộc khi tạo tiến trình mới");
                    }
                    WatchProgress newWp = new WatchProgress();
                    newWp.setUserId(userId);
                    newWp.setMovieId(movieId);
                    newWp.setEpisodeNumber(episodeNumber);
                    newWp.setSlug(request.getSlug());
                    return newWp;
                });

        if (request.getPositionSeconds() != null) wp.setPositionSeconds(request.getPositionSeconds());
        if (request.getIsCompleted() != null)     wp.setCompleted(request.getIsCompleted());
        wp.setLastWatchedAt(LocalDateTime.now());

        WatchProgress saved = watchProgressRepository.save(wp);
        WatchProgressResponseDto response = toResponse(saved);
        cacheToRedis(response);
        return response;
    }

    public WatchProgressResponseDto getProgress(Long userId, String movieId, int episodeNumber) {
        String key = redisKey(userId, movieId, episodeNumber);
        try {
            String cached = jedis.get(key);
            if (cached != null) {
                return objectMapper.readValue(cached, WatchProgressResponseDto.class);
            }
        } catch (Exception e) {
            log.warn("Redis read failed for key {}: {}", key, e.getMessage());
        }

        return watchProgressRepository
                .findByUserIdAndMovieIdAndEpisodeNumber(userId, movieId, episodeNumber)
                .map(wp -> {
                    WatchProgressResponseDto dto = toResponse(wp);
                    cacheToRedis(dto);
                    return dto;
                })
                .orElse(WatchProgressResponseDto.builder()
                        .userId(userId)
                        .movieId(movieId)
                        .episodeNumber(episodeNumber)
                        .positionSeconds(0)
                        .isCompleted(false)
                        .build());
    }

    public List<WatchProgressResponseDto> getAllProgress(Long userId, String movieId) {
        return watchProgressRepository.findByUserIdAndMovieId(userId, movieId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private void cacheToRedis(WatchProgressResponseDto dto) {
        try {
            String key = redisKey(dto.getUserId(), dto.getMovieId(), dto.getEpisodeNumber());
            jedis.setex(key, REDIS_TTL_SECONDS, objectMapper.writeValueAsString(dto));
        } catch (Exception e) {
            log.warn("Redis write failed: {}", e.getMessage());
        }
    }

    private String redisKey(Long userId, String movieId, int episodeNumber) {
        return "wp:" + userId + ":" + movieId + ":" + episodeNumber;
    }

    WatchProgressResponseDto toResponse(WatchProgress wp) {
        return WatchProgressResponseDto.builder()
                .userId(wp.getUserId())
                .movieId(wp.getMovieId())
                .slug(wp.getSlug())
                .episodeNumber(wp.getEpisodeNumber())
                .positionSeconds(wp.getPositionSeconds())
                .isCompleted(wp.isCompleted())
                .lastWatchedAt(wp.getLastWatchedAt())
                .build();
    }
}
