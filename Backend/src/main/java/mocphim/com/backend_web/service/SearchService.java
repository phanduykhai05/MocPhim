package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mocphim.com.backend_web.entity.SearchHistory;
import mocphim.com.backend_web.repository.SearchHistoryRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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


    @Cacheable(value = "searchHistory", key = "'top_' + #limit")
    public List<SearchHistory> getHistory(int limit) {
        return searchHistoryRepository.findAll(
            PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "searchCount"))
        ).getContent();
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
