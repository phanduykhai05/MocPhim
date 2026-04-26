package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CountryService {

    private final OPhimService ophimService;

    @Cacheable("countries")
    public Object getCountries() {
        return ophimService.get("/quoc-gia");
    }

    @Cacheable(value = "countries", key = "#slug + '_' + #params.hashCode()")
    public Object getCountryMovies(String slug, Map<String, String> params) {
        return ophimService.get("/quoc-gia/" + slug, params);
    }
}
