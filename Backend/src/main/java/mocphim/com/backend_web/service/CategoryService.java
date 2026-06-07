package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final OPhimService ophimService;

    @Cacheable("categories")
    public Object getCategories() {
        return ophimService.get("/the-loai");
    }

    @Cacheable(value = "categories", key = "#slug + '_' + #params.hashCode()")
    public Object getCategoryMovies(String slug, Map<String, String> params) {
        return ophimService.get("/the-loai/" + slug, params);
    }
}
