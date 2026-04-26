package mocphim.com.backend_web.controller;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.response.ApiResponse;
import mocphim.com.backend_web.entity.MovieSync;
import mocphim.com.backend_web.repository.MovieSyncRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sync")
@RequiredArgsConstructor
public class SyncController {

    private final MovieSyncRepository movieSyncRepository;

    @GetMapping("/movies")
    public ResponseEntity<ApiResponse<Object>> getSyncedMovies(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        Page<MovieSync> result = movieSyncRepository.findAll(
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        ApiResponse.Pagination pagination = new ApiResponse.Pagination(
            result.getNumber() + 1,
            result.getTotalPages(),
            result.getTotalElements(),
            result.getSize()
        );
        return ResponseEntity.ok(ApiResponse.success(result.getContent(), pagination));
    }

    @GetMapping("/movies/count")
    public ResponseEntity<ApiResponse<Object>> count() {
        return ResponseEntity.ok(ApiResponse.success(movieSyncRepository.count()));
    }
}
