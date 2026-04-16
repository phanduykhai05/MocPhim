import React from 'react';

const SeoSection: React.FC = () => {
  return (
    // section-second: padding-bottom 4rem (16 * 0.25rem = 4rem)
    <div id="section-second" className="pb-16 bg-[#191B24]">
      
      {/* Container: Giới hạn chiều rộng 1120px theo code gốc */}
      <div className="container mx-auto px-5 w-full max-w-[1120px]">
        
        {/* About Block: Chứa nội dung SEO với các class CSS dạng lồng (Nested) */}
        <div 
          id="about" 
          className="
            relative text-[1.1em] leading-[1.7] text-[#cfcfcf] px-4 md:px-[6rem]
            
            /* Headings */
            [&_h2]:text-[1.6em] [&_h2]:my-6 [&_h2]:text-[#fecf59] [&_h2]:font-medium [&_h2]:leading-[1.6]
            [&_h3]:text-[1.4em] [&_h3]:my-4 [&_h3]:text-white [&_h3]:font-medium [&_h3]:leading-[1.6]
            [&_h4]:text-[1.2em] [&_h4]:my-4 [&_h4]:text-white [&_h4]:font-medium [&_h4]:leading-[1.6]
            
            /* Paragraph & Bold */
            [&_p]:mb-4 
            [&_b]:font-semibold [&_b]:text-white
            
            /* Lists */
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
            
            /* Links */
            [&_a]:text-[#8b91ff] hover:[&_a]:text-[#fecf59] [&_a]:transition-colors [&_a]:underline
          "
        >
          <h2>MocPhim – Phim hay cả rổ | Xem phim online miễn phí 2026</h2>
          <p>
            <b>MocPhim</b> là nền tảng <b>xem phim online miễn phí</b> hàng đầu Việt Nam, cung cấp kho phim khổng lồ với hơn hàng nghìn bộ phim chất lượng cao từ <b>phim lẻ</b>, <b>phim bộ</b>, <b>phim chiếu rạp</b> đến <b>hoạt hình</b>. Tất cả đều được cập nhật Vietsub, thuyết minh nhanh chóng mỗi ngày.
          </p>

          <h3>Tại sao chọn MocPhim?</h3>
          <ul>
            <li><b>Miễn phí 100%:</b> Xem phim không giới hạn, không cần đăng ký tài khoản.</li>
            <li><b>Chất lượng HD – Full HD:</b> Hình ảnh sắc nét, âm thanh sống động.</li>
            <li><b>Cập nhật nhanh:</b> Phim mới 2026 được cập nhật hàng ngày từ Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ và nhiều quốc gia khác.</li>
            <li><b>Vietsub &amp; Thuyết minh:</b> Phụ đề tiếng Việt chính xác, thuyết minh chuyên nghiệp.</li>
            <li><b>Tốc độ tải nhanh:</b> Máy chủ tối ưu, xem phim mượt mà không lag.</li>
            <li><b>Giao diện thân thiện:</b> Thiết kế hiện đại, dễ tìm kiếm, tương thích mọi thiết bị.</li>
          </ul>

          <h3>Kho phim đa dạng tại MocPhim</h3>
          <p>
            MocPhim phục vụ mọi sở thích với đầy đủ thể loại: <b style={{ color: '#fecf59' }}>Phim Lẻ</b>, <b style={{ color: '#fecf59' }}>Phim Bộ</b>, <b style={{ color: '#fecf59' }}>Phim Chiếu Rạp</b>, <b style={{ color: '#fecf59' }}>Hoạt Hình</b>, <b style={{ color: '#fecf59' }}>Phim Hàn Quốc</b>, <b style={{ color: '#fecf59' }}>Phim Trung Quốc</b>, <b style={{ color: '#fecf59' }}>Phim Thái Lan</b>, <b style={{ color: '#fecf59' }}>Phim Nhật Bản</b>, <b style={{ color: '#fecf59' }}>Phim Âu Mỹ</b> và nhiều thể loại khác.
          </p>

          <h4>Phim theo quốc gia</h4>
          <p>
            Khám phá phim từ nhiều quốc gia: <span style={{ color: '#fecf59' }}>Phim Hàn Quốc</span>, <span style={{ color: '#fecf59' }}>Phim Trung Quốc</span>, <span style={{ color: '#fecf59' }}>Phim Thái Lan</span>, <span style={{ color: '#fecf59' }}>Phim Nhật Bản</span>, <span style={{ color: '#fecf59' }}>Phim Âu Mỹ</span>, <span style={{ color: '#fecf59' }}>Phim Việt Nam</span>, <span style={{ color: '#fecf59' }}>Phim Ấn Độ</span> và nhiều quốc gia khác.
          </p>

          <h3>Tính năng nổi bật của MocPhim 2026</h3>
          <ul>
            <li><b>Lưu phim yêu thích:</b> Tạo danh sách phim cá nhân, theo dõi diễn viên yêu thích.</li>
            <li><b>Xem tiếp từ nơi dừng lại:</b> Tự động lưu tiến trình xem, tiếp tục bất cứ lúc nào.</li>
            <li><b>Đánh giá &amp; bình luận:</b> Chia sẻ cảm nhận, trao đổi với cộng đồng yêu phim.</li>
            <li><b>Lịch chiếu phim:</b> Cập nhật lịch phát sóng phim bộ mới nhất.</li>
            <li><b>Đa nguồn phát:</b> Nhiều server phát phim, đảm bảo luôn xem được.</li>
          </ul>

          <h3>Xem phim online miễn phí tại MocPhim</h3>
          <p>
            <b>MocPhim</b> cam kết mang đến trải nghiệm <b>xem phim online</b> tốt nhất cho người dùng Việt Nam. Với kho phim được cập nhật liên tục, chất lượng hình ảnh cao và hoàn toàn miễn phí, MocPhim là điểm đến lý tưởng cho những ai đam mê điện ảnh. Truy cập <b style={{ color: '#fecf59' }}>MocPhim</b> ngay hôm nay!
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default SeoSection;