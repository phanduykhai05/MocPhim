import type { WatchMovie } from '@/app/(default)/xem-phim/[slug]/types';

const watchMovies: WatchMovie[] = [
  {
    slug: 'cac-te-bao-cua-yumi-phan-3',
    title: 'Các Tế Bào Của Yumi - Phần 3',
    altTitle: 'Yumi\'s Cells Season 3',
    year: 2026,
    quality: 'FHD',
    duration: '45 phút / tập',
    poster: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&w=220&q=80',
    ageRating: 'T13',
    imdbScore: 8.3,
    sectionLabel: 'Phần 3',
    genres: ['Tình cảm', 'Hài', 'Đời sống'],
    country: 'Hàn Quốc',
    status: 'Đang cập nhật',
    casts: ['Kim Go-eun', 'Ahn Bo-hyun', 'Jinyoung', 'Lee Yoo-bi', 'Park Jin-young', 'Shin Ye-eun'],
    description:
      'Câu chuyện tiếp tục với Yumi cùng những tế bào cảm xúc đầy hài hước, theo chân hành trình trưởng thành trong tình yêu và công việc.',
    episodes: Array.from({ length: 12 }, (_, index) => ({
      number: index + 1,
      name: `Tập ${index + 1}`,
    })),
    servers: [
      { id: 0, name: 'Vietsub #1' },
      { id: 1, name: 'Vietsub #2' },
      { id: 2, name: 'Thuyết minh' },
    ],
  },
];

const slugToTitle = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const getWatchMovieBySlug = (slug: string): WatchMovie => {
  const movie = watchMovies.find((item) => item.slug === slug);

  if (movie) {
    return movie;
  }

  return {
    slug,
    title: slugToTitle(slug),
    altTitle: 'Đang cập nhật',
    year: 2026,
    quality: 'FHD',
    duration: '45 phút / tập',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=220&q=80',
    ageRating: 'T13',
    imdbScore: 7.5,
    sectionLabel: 'Phần 1',
    genres: ['Đang cập nhật'],
    country: 'Đang cập nhật',
    status: 'Đang cập nhật',
    casts: ['Đang cập nhật'],
    description: 'Thông tin bộ phim đang được cập nhật.',
    episodes: Array.from({ length: 20 }, (_, index) => ({
      number: index + 1,
      name: `Tập ${index + 1}`,
    })),
    servers: [
      { id: 0, name: 'Vietsub #1' },
      { id: 1, name: 'Vietsub #2' },
    ],
  };
};
