import React from 'react';
import { TopDetailBanner } from '@/app/(default)/phim/[slug]/components/Backgroud/components/TopDetailBanner';

interface BackgroundProps {
  backdropUrl: string;
}

const Background: React.FC<BackgroundProps> = ({ backdropUrl }) => {
  return <TopDetailBanner imageUrl={backdropUrl} />;
};

export default Background;