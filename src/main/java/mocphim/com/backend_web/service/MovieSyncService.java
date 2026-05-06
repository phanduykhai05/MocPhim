package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.entity.MovieSync;
import mocphim.com.backend_web.repository.MovieSyncRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieSyncService {

    private final MovieSyncRepository movieSyncRepository;

    @Cacheable(value = "syncedMovies", key = "'page_' + #page + '_' + #size")
    public Page<MovieSync> getPage(int page, int size) {
        return movieSyncRepository.findAll(
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
    }

    @Cacheable(value = "syncedMovies", key = "'count'")
    public long count() {
        return movieSyncRepository.count();
    }

    @Cacheable(value = "syncedMovies", key = "'all'")
    public List<MovieSync> getTop500() {
        return movieSyncRepository.findAll(
            PageRequest.of(0, 500, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
    }
}
