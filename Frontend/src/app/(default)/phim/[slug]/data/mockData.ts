import { MovieDetailData } from '../types';

export const movieDetailMockData: MovieDetailData = {
  movie: {
    title: 'Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng',
    subtitle: 'Avatar: The Last Airbender',
    year: '2026',
    rating: '4.6',
    duration: '99 Phút',
    country: 'Âu Mỹ',
    director: 'Lauren Montgomery',
    status: 'Đã hoàn thành: 1',
    quality: 'HD',
    imdb: 'IMDb 0',
    poster:
      'https://image.tmdb.org/t/p/w500/qxZB8h9fQvRJwW8Q6z6NjlqQfyz.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg',
    genres: ['Gia Đình', 'Hành Động', 'Phiêu Lưu'],
    description:
      'Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng (Avatar: The Last Airbender) Thế giới vừa khôi phục được hòa bình sau nhiều năm chiến tranh, thì loài người lại đối mặt với một nguy cơ mới - một nguồn sức mạnh cổ xưa sắp bị đánh thức. Aang, Tiết Khí Sư cuối cùng và cũng là Avatar trẻ tuổi, phát hiện ra manh mối về năng lượng có thể giúp bảo tồn nền văn hóa của dân tộc mình trước khi nó biến mất mãi.',
  },
  episodes: [
    {
      id: 'ep-1',
      label: '#Hà Nội (Vietsub)',
      title: 'Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng',
      poster:
        'https://image.tmdb.org/t/p/w500/qxZB8h9fQvRJwW8Q6z6NjlqQfyz.jpg',
    },
    {
      id: 'ep-2',
      label: 'Vietsub #1',
      title: 'Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng',
      poster:
        'https://image.tmdb.org/t/p/w500/qxZB8h9fQvRJwW8Q6z6NjlqQfyz.jpg',
    },
    {
      id: 'ep-3',
      label: '#Hà Nội (Vietsub)',
      title: 'Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng',
      poster:
        'https://image.tmdb.org/t/p/w500/qxZB8h9fQvRJwW8Q6z6NjlqQfyz.jpg',
    },
    {
      id: 'ep-4',
      label: 'Vietsub #1',
      title: 'Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng',
      poster:
        'https://image.tmdb.org/t/p/w500/qxZB8h9fQvRJwW8Q6z6NjlqQfyz.jpg',
    },
  ],
  comments: [
    {
      id: 'c-1',
      author: 'Huang Yu',
      time: '4 giờ trước',
      content:
        'Từ khi coi phim hoạt hình Invincible của Amazon Prime xong, có lẽ nào t không còn tiết đủ dopamine nữa khi quay lại coi hoạt hình tuổi thơ của nickelodeon này, đúng là hoạt hình dành cho con nít, đánh đấm banh nhà banh cửa, dùng vũ khí sặc lẹm xiên nhau mà ko thấy cảnh thịt nát xương tan.',
      likes: 0,
      replies: 3,
    },
    {
      id: 'c-2',
      author: 'GOD945',
      time: '9 giờ trước',
      content:
        'thực sự thì đã 14 năm kể từ lần cuối t theo dõi là hành trình của Aang thì h t vẫn thấy nó hay vãi',
      likes: 0,
    },
  ],
  topWeekMovies: [
    {
      id: 't-1',
      rank: 1,
      title: 'Giải Mã Trọng Án',
      subtitle: 'Case X Decoded',
      quality: 'HD',
      episode: 'Tập 3',
      poster:
        'https://image.tmdb.org/t/p/w342/4t7v6LQ8E7NQfJwQ0N7rZq2lJ0m.jpg',
    },
    {
      id: 't-2',
      rank: 2,
      title: 'Mật Ngữ Kỳ',
      subtitle: 'The Epoch of Miyu',
      quality: 'HD',
      episode: 'Tập 12',
      poster:
        'https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    },
    {
      id: 't-3',
      rank: 3,
      title: 'Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng',
      subtitle: 'Avatar: The Last Airbender',
      quality: 'HD',
      episode: 'Full',
      poster:
        'https://image.tmdb.org/t/p/w500/qxZB8h9fQvRJwW8Q6z6NjlqQfyz.jpg',
    },
    {
      id: 't-4',
      rank: 4,
      title: 'Untold: Jail Blazers',
      subtitle: 'Untold: Jail Blazers',
      quality: 'HD',
      episode: 'Full',
      poster: 'https://image.tmdb.org/t/p/w342/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    },
    {
      id: 't-5',
      rank: 5,
      title: 'Máy Nướng Bánh',
      subtitle: 'Toaster',
      quality: 'HD',
      episode: 'Full',
      poster: 'https://image.tmdb.org/t/p/w342/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg',
    },
    {
      id: 't-6',
      rank: 6,
      title: 'Tần Số Ngầm',
      subtitle: 'Undertone',
      quality: 'HD',
      episode: 'Full',
      poster: 'https://image.tmdb.org/t/p/w342/yRt7MGBElkLQOYx7NfM7VY9lYhN.jpg',
    },
    {
      id: 't-7',
      rank: 7,
      title: 'Công Chúa Chiến Binh Và Vua Dã Ma',
      subtitle: 'The Warrior Princess and the Barbaric King',
      quality: 'HD',
      episode: 'Full',
      poster: 'https://image.tmdb.org/t/p/w342/xFU8JgP3i0H8xYj1G8k6R9x4Y09.jpg',
    },
    {
      id: 't-8',
      rank: 8,
      title: 'Máu Nóng',
      subtitle: 'Hot Blooded: Once Upon a Time in Korea',
      quality: 'HD',
      episode: 'Full',
      poster: 'https://image.tmdb.org/t/p/w342/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg',
    },
    {
      id: 't-9',
      rank: 9,
      title: 'Giá Trị Tuyệt Đối Của Lãng Mạn',
      subtitle: 'Absolute Value of Romance',
      quality: 'HD',
      episode: 'Trailer',
      poster: 'https://image.tmdb.org/t/p/w342/k3J2lYQYd4fVQJr8n6s5N7Yx0fW.jpg',
    },
    {
      id: 't-10',
      rank: 10,
      title: 'Không Bông Tuyết Nào Trong Sạch',
      subtitle: 'The Woman in the White Car',
      quality: 'FHD',
      episode: 'Full',
      poster: 'https://image.tmdb.org/t/p/w342/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    },
  ],
};
