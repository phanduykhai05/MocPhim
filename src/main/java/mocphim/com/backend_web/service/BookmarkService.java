package mocphim.com.backend_web.service;

import lombok.RequiredArgsConstructor;
import mocphim.com.backend_web.dto.request.BookmarkRequestDto;
import mocphim.com.backend_web.dto.response.BookmarkResponseDto;
import mocphim.com.backend_web.entity.Bookmark;
import mocphim.com.backend_web.entity.WatchProgress;
import mocphim.com.backend_web.repository.BookmarkRepository;
import mocphim.com.backend_web.repository.WatchProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final WatchProgressRepository watchProgressRepository;

    public List<BookmarkResponseDto> getBookmarksByUserId(Long userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdOrderByBookmarkDateDesc(userId);
        if (bookmarks.isEmpty()) return Collections.emptyList();

        // Batch load progress cho tất cả phim, lấy tập xem gần nhất theo lastWatchedAt
        List<String> movieIds = bookmarks.stream().map(Bookmark::getMovieId).collect(Collectors.toList());
        Map<String, WatchProgress> latestProgressByMovie = watchProgressRepository
                .findByUserIdAndMovieIdIn(userId, movieIds)
                .stream()
                .collect(Collectors.toMap(
                        WatchProgress::getMovieId,
                        wp -> wp,
                        (a, b) -> a.getLastWatchedAt().isAfter(b.getLastWatchedAt()) ? a : b
                ));

        return bookmarks.stream()
                .map(b -> toResponse(b, latestProgressByMovie.get(b.getMovieId())))
                .collect(Collectors.toList());
    }

    public boolean isBookmarked(Long userId, String movieId) {
        return bookmarkRepository.existsByUserIdAndMovieId(userId, movieId);
    }

    public BookmarkResponseDto addBookmark(BookmarkRequestDto request) {
        if (bookmarkRepository.existsByUserIdAndMovieId(request.getUserId(), request.getMovieId())) {
            throw new IllegalArgumentException("Already bookmarked");
        }
        Bookmark bookmark = new Bookmark();
        bookmark.setUserId(request.getUserId());
        bookmark.setMovieId(request.getMovieId());
        bookmark.setSlug(request.getSlug());
        bookmark.setMovieTitle(request.getMovieTitle());
        bookmark.setPosterUrl(request.getPosterUrl());
        bookmark.setMediaType(request.getMediaType());
        bookmark.setBookmarkDate(LocalDateTime.now());
        return toResponse(bookmarkRepository.save(bookmark), null);
    }

    @Transactional
    public void deleteBookmark(Long userId, String movieId) {
        if (!bookmarkRepository.existsByUserIdAndMovieId(userId, movieId)) {
            throw new IllegalArgumentException("Bookmark không tồn tại");
        }
        bookmarkRepository.deleteByUserIdAndMovieId(userId, movieId);
    }

    private BookmarkResponseDto toResponse(Bookmark bookmark, WatchProgress wp) {
        BookmarkResponseDto.BookmarkResponseDtoBuilder builder = BookmarkResponseDto.builder()
                .id(bookmark.getId())
                .userId(bookmark.getUserId())
                .movieId(bookmark.getMovieId())
                .slug(bookmark.getSlug())
                .movieTitle(bookmark.getMovieTitle())
                .posterUrl(bookmark.getPosterUrl())
                .mediaType(bookmark.getMediaType())
                .bookmarkDate(bookmark.getBookmarkDate());

        if (wp != null) {
            builder.latestEpisode(wp.getEpisodeNumber())
                   .positionSeconds(wp.getPositionSeconds())
                   .episodeCompleted(wp.isCompleted())
                   .lastWatchedAt(wp.getLastWatchedAt());
        }

        return builder.build();
    }
}
