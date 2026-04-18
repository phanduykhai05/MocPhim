import React from "react";

interface TopSeriesCardProps {
  index: number;
  movie: {
    title: string;
    alias: string;
    slug: string;
    thumb: string;
    episodeText: string;
    badges: { type: "pd" | "lt" | "tm"; text: string }[];
  };
}

export const TopSeriesCard = ({ index, movie }: TopSeriesCardProps) => {
  const isReversed = index % 2 === 1;

  // Polygon phức tạp từ CSS cũ của bạn
  const customClipPath =
    "polygon(94.239% 100%, 5.761% 100%, 5.761% 100%, 4.826% 99.95%, 3.94% 99.803%, 3.113% 99.569%, 2.358% 99.256%, 1.687% 98.87%, 1.111% 98.421%, 0.643% 97.915%, 0.294% 97.362%, 0.075% 96.768%, 0% 96.142%, 0% 3.858%, 0% 3.858%, 0.087% 3.185%, 0.338% 2.552%, 0.737% 1.968%, 1.269% 1.442%, 1.92% 0.984%, 2.672% 0.602%, 3.512% 0.306%, 4.423% 0.105%, 5.391% 0.008%, 6.4% 0.024%, 94.879% 6.625%, 94.879% 6.625%, 95.731% 6.732%, 96.532% 6.919%, 97.272% 7.178%, 97.942% 7.503%, 98.533% 7.887%, 99.038% 8.323%, 99.445% 8.805%, 99.747% 9.326%, 99.935% 9.88%, 100% 10.459%, 100% 96.142%, 100% 96.142%, 99.925% 96.768%, 99.706% 97.362%, 99.357% 97.915%, 98.889% 98.421%, 98.313% 98.87%, 97.642% 99.256%, 96.887% 99.569%, 96.06% 99.803%, 95.174% 99.95%, 94.239% 100%)";

  const mirroredClipPath = customClipPath.replace(
    /(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/g,
    (_, x, y) => `${(100 - Number(x)).toFixed(3).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")}% ${y}%`
  );

  const cardClipPath = isReversed ? mirroredClipPath : customClipPath;

  return (
    <div className="flex flex-col gap-3 relative w-full group">
      {/* Thumbnail phim */}
      <a
        href={`/phim/${movie.slug}`}
        className="relative w-full aspect-[2/3] rounded-xl overflow-hidden block bg-[#191b24]"
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          aspectRatio: "2 / 3",
          overflow: "hidden",
        }}
      >
        <div
          className="absolute inset-0 bg-white/5 z-10"
          style={{ clipPath: cardClipPath }}
        />
        <img
          alt={`Xem Phim ${movie.title}`}
          loading="lazy"
          src={movie.thumb}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 "
          style={{
            clipPath: cardClipPath,
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Pin Badge (PĐ, LT, TM) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex justify-between items-stretch rounded-t-[4px] overflow-hidden shadow-[0_0_5px_2px_rgba(0,0,0,0.1)] whitespace-nowrap">
          {movie.badges.map((badge, i) => (
            <div
              key={i}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-normal text-white ${
                badge.type === "pd"
                  ? "bg-[#5e6070]"
                  : badge.type === "lt"
                  ? "bg-[#1667cf]"
                  : "bg-green-600" // Cho Thuyết Minh (TM) nếu có
              }`}
            >
              <span>{badge.type === "pd" ? "PĐ." : badge.type === "lt" ? "LT." : "TM."}</span>
              <strong>{badge.text}</strong>
            </div>
          ))}
        </div>
      </a>

      {/* Thông tin Phim & Số Top */}
      <div className="pl-[66px] relative text-left isolate flex flex-col gap-1">
        {/* Số bự có gradient */}
        <div className="absolute left-0 top-0 w-[50px] leading-none text-center text-[4.2em] font-extrabold italic text-transparent bg-clip-text bg-gradient-to-tr from-[#fecf59] to-[#fff1cc] z-[100] pointer-events-none">
          {index + 1}
        </div>

        {/* Tên phim */}
        <h4 className="text-white text-base font-normal line-clamp-1 m-0 relative z-0">
          <a href={`/phim/${movie.slug}`} className="hover:text-[#f472b6] transition-colors">
            {movie.title}
          </a>
        </h4>

        {/* Tên tiếng Anh/Bí danh */}
        <div className="text-gray-400 text-sm line-clamp-1 relative z-0">
          {movie.alias}
        </div>

        {/* Tập phim hiện tại */}
        <div className="relative z-0 mt-1">
          <span className="text-xs bg-white/10 text-[#a9a9bc] px-2 py-1 rounded inline-block">
            {movie.episodeText}
          </span>
        </div>
      </div>
    </div>
  );
};