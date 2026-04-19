package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final OPhimService ophimService;

    @Cacheable(value = "movieList", key = "#slug + '_' + #params.hashCode()")
    public Object getMovieList(String slug, Map<String, String> params) {
        return ophimService.get("/danh-sach/" + slug, params);
    }

    @Cacheable(value = "movieDetail", key = "#slug")
    public Object getMovieDetail(String slug) {
        return ophimService.get("/phim/" + slug);
    }

    @Cacheable(value = "movieDetail", key = "#slug + '_images'")
    public Object getMovieImages(String slug) {
        return ophimService.get("/phim/" + slug + "/images");
    }

    @Cacheable(value = "movieDetail", key = "#slug + '_peoples'")
    public Object getMoviePeoples(String slug) {
        return ophimService.get("/phim/" + slug + "/peoples");
    }

    @Cacheable(value = "movieDetail", key = "#slug + '_keywords'")
    public Object getMovieKeywords(String slug) {
        return ophimService.get("/phim/" + slug + "/keywords");
    }
}
