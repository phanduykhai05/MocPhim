export interface Movie {
  id: string;
  title: string;
  alias: string;
  year: string;
  quality: string;
  subtitle: string;
  status: string;
  genres: string[];
  description: string;
  poster: string;
  slug: string;
}

export const FAKE_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Tiếng Thét 7',
    alias: 'Scream 7',
    year: '2026',
    quality: 'FHD',
    subtitle: 'Vietsub + Thuyết Minh',
    status: 'Full',
    genres: ['Bí Ẩn', 'Hình Sự', 'Kinh Dị'],
    description: 'Sau nhiều năm trốn chạy khỏi quá khứ đẫm máu ở Woodsboro, Sidney Prescott cuối cùng cũng tìm được bình yên trong một thị trấn nhỏ yên ả, nơi cô...',
    poster: 'https://rophims.vip/wp-content/uploads/2026/04/humint-38611-poster-1.jpg',
    slug: 'tieng-thet-7'
  },
  {
    id: '2',
    title: 'Huyền Thoại Aang',
    alias: 'Avatar: The Last Airbender',
    year: '2026',
    quality: 'HD',
    subtitle: 'Vietsub',
    status: 'Full',
    genres: ['Gia Đình', 'Hành Động', 'Phiêu Lưu'],
    description: 'Thế giới vừa khôi phục được hòa bình sau nhiều năm chiến tranh, thì loài người lại đối mặt với một nguy cơ mới...',
    poster: 'https://rophims.vip/wp-content/uploads/2026/04/huyen-thoai-aang-tiet-khi-su-cuoi-cung-48635-poster.jpg',
    slug: 'huyen-thoai-aang'
  },
  // Thêm 3 phim nữa tương tự để đủ 5...
];