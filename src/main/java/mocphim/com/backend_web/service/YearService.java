package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class YearService {

    private final OPhimService ophimService;

    @Cacheable("years")
    public Object getYears() {
        return ophimService.get("/nam-phat-hanh");
    }

    @Cacheable(value = "years", key = "#year + '_' + #params.hashCode()")
    public Object getYearMovies(int year, Map<String, String> params) {
        return ophimService.get("/nam-phat-hanh/" + year, params);
    }
}
