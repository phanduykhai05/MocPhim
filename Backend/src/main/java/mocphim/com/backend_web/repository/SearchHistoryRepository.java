package mocphim.com.backend_web.repository;

import mocphim.com.backend_web.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    Optional<SearchHistory> findByKeyword(String keyword);
}
