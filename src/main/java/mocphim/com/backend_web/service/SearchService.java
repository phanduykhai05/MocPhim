package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mocphim.com.backend_web.entity.SearchHistory;
import mocphim.com.backend_web.repository.SearchHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class SearchService {

    private final OPhimService ophimService;
    private final SearchHistoryRepository searchHistoryRepository;

    public Object search(String keyword, Map<String, String> params) {
        saveKeyword(keyword);
        params.put("keyword", keyword);
        return ophimService.get("/tim-kiem", params);
    }

    private void saveKeyword(String keyword) {
        try {
            searchHistoryRepository.findByKeyword(keyword).ifPresentOrElse(
                sh -> {
                    sh.setSearchCount(sh.getSearchCount() + 1);
                    sh.setLastSearchedAt(LocalDateTime.now());
                    searchHistoryRepository.save(sh);
                },
                () -> searchHistoryRepository.save(new SearchHistory(keyword))
            );
        } catch (Exception e) {
            log.warn("Failed to save search history for keyword '{}': {}", keyword, e.getMessage());
        }
    }
}
