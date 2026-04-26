package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final OPhimService ophimService;

    @Cacheable("home")
    public Object getHome() {
        return ophimService.get("/home");
    }
}
