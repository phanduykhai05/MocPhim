import React from 'react';
import { TopDetailBanner } from '@/app/(default)/phim/[slug]/components/Backgroud/components/TopDetailBanner';

const MovieDetailPage: React.FC = () => {
  const posterUrl = "https://rophims.vip/wp-content/uploads/2026/04/huyen-thoai-aang-tiet-khi-su-cuoi-cung-48635-poster.jpg";

  return (
    <TopDetailBanner imageUrl={posterUrl} />
  );
};

export default MovieDetailPage;