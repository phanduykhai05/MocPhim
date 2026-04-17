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
    title: 'Mật Lệnh Sao Băng',
    alias: 'Meteor Directive',
    year: '2025',
    quality: 'FHD',
    subtitle: 'Vietsub + Thuyết Minh',
    status: 'Full',
    genres: ['Hành Động', 'Giật Gân', 'Khoa Học'],
    description: 'Một cựu phi công quân sự nhận nhiệm vụ ngăn chặn vệ tinh bí mật rơi xuống khu dân cư đông đúc trước khi cuộc chiến dữ liệu toàn cầu bùng nổ.',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    slug: 'mat-lenh-sao-bang'
  },
  {
    id: '2',
    title: 'Bờ Biển Không Trăng',
    alias: 'Moonless Coast',
    year: '2026',
    quality: 'HD',
    subtitle: 'Vietsub',
    status: 'Tập 10',
    genres: ['Bí Ẩn', 'Chính Kịch', 'Tâm Lý'],
    description: 'Một nữ phóng viên quay lại thị trấn ven biển nơi chị gái mất tích và phát hiện chuỗi tín hiệu vô tuyến kỳ lạ chỉ xuất hiện vào những đêm không trăng.',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80',
    slug: 'bo-bien-khong-trang'
  },
  {
    id: '3',
    title: 'Đội Truy Kích Số 9',
    alias: 'Strike Unit Nine',
    year: '2024',
    quality: 'HD',
    subtitle: 'Vietsub + TM',
    status: 'Full',
    genres: ['Tội Phạm', 'Hành Động', 'Phiêu Lưu'],
    description: 'Nhóm đặc nhiệm bị phản bội trong một phi vụ giải cứu con tin và phải vừa chạy trốn khỏi hệ thống vừa tìm ra kẻ đứng sau âm mưu dàn dựng.',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    slug: 'doi-truy-kich-so-9'
  },
  {
    id: '4',
    title: 'Thị Trấn Mất Tín Hiệu',
    alias: 'No Signal Town',
    year: '2026',
    quality: 'FHD',
    subtitle: 'Vietsub',
    status: 'Tập 08',
    genres: ['Kinh Dị', 'Bí Ẩn', 'Siêu Nhiên'],
    description: 'Sau một cơn bão từ, toàn bộ thiết bị liên lạc trong thị trấn đồng loạt tắt lịm và những người dân bắt đầu nghe thấy tiếng gọi đến từ khu rừng cấm.',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    slug: 'thi-tran-mat-tin-hieu'
  },
  {
    id: '5',
    title: 'Đường Đua Bão Lửa',
    alias: 'Blaze Circuit',
    year: '2025',
    quality: 'HD',
    subtitle: 'Vietsub + TM',
    status: 'Full',
    genres: ['Thể Thao', 'Hành Động', 'Kịch Tính'],
    description: 'Một tay đua đường phố giải nghệ buộc trở lại đường đua bất hợp pháp để cứu em trai, đồng thời đối mặt với quá khứ từng khiến anh mất tất cả.',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
    slug: 'duong-dua-bao-lua'
  },
];