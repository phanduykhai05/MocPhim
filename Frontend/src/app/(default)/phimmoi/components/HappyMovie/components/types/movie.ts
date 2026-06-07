export interface MovieHorizontal {
  id: string;
  title: string;
  originalTitle: string;
  posterUrl: string;
  thumbUrl: string;
  slug: string;
  tags: string[];
  badgeStatus?: 'Sắp chiếu' | 'Full' | 'P.Đề' | string;
  badgeCount?: string | number;
}