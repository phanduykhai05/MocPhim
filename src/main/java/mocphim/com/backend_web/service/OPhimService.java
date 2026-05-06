package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mocphim.com.backend_web.exception.OPhimApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class OPhimService {

    @Value("${ophim.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    public Object get(String path) {
        return get(path, Collections.emptyMap());
    }

    public Object get(String path, Map<String, String> params) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + path);
        params.forEach(builder::queryParam);
        URI uri = builder.build().encode().toUri();

        long start = System.currentTimeMillis();
        try {
            ResponseEntity<Object> response = restTemplate.getForEntity(uri, Object.class);
            log.debug("OPhim GET {} -> {} ({}ms)", uri, response.getStatusCode(), System.currentTimeMillis() - start);
            return response.getBody();
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            log.debug("OPhim GET {} -> {} ({}ms)", uri, ex.getStatusCode(), System.currentTimeMillis() - start);
            throw new OPhimApiException("OPhim API error: " + ex.getMessage(), ex.getStatusCode().value());
        } catch (Exception ex) {
            log.debug("OPhim GET {} -> ERROR ({}ms): {}", uri, System.currentTimeMillis() - start, ex.getMessage());
            throw new OPhimApiException("OPhim API unreachable: " + ex.getMessage(), 503);
        }
    }
}
