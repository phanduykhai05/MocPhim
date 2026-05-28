'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MovieItem, MoviesImagesData, KeywordsData } from '@/lib/api/movie';
import { MovieActionBar } from '@/app/(default)/phim/[slug]/components/Hero/components/MovieActionBar';
import { CommentSection } from '@/app/(default)/phim/[slug]/components/Hero/components/CommentSection';

interface HeroProps {
  movie: MovieItem;
  cdnImage: string;
  images: MoviesImagesData | null;
  keywords: KeywordsData | null;
  initialTap: number;
  initialSv: number;
}

const TABS = [
  { id: 'episodes', label: 'Tập phim' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'keywords', label: 'Từ khóa' },
  { id: 'suggestion', label: 'Đề xuất' },
];

export const MovieMainContent = ({ movie, cdnImage, images, keywords, initialTap, initialSv }: HeroProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('episodes');
  const [selectedServerIdx, setSelectedServerIdx] = useState(initialSv);
  const [selectedEpIdx, setSelectedEpIdx] = useState(Math.max(0, initialTap - 1));

  const servers = movie.episodes ?? [];
  const currentServer = servers[selectedServerIdx];
  const currentEp = currentServer?.server_data?.[selectedEpIdx];
  const currentEmbedSrc = currentEp?.link_embed?.trim() || null;
  const trailerEmbedSrc = movie.trailer_url?.trim()
    ? movie.trailer_url.replace('watch?v=', 'embed/')
    : null;

  return (
    <div className="flex-grow flex flex-col bg-[#191b24]/60 backdrop-blur-[20px] rounded-r-2xl rounded-l-none lg:rounded-[0_1.25rem_1.25rem_0] overflow-hidden lg:ml-[-33px] ml-0">

      <MovieActionBar movie={movie} />

      <div className="flex flex-col pb-10">

        {/* Tabs bar */}
        <div className="flex overflow-x-auto border-b border-white/10 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#f472b6] text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tập phim tab ── */}
        {activeTab === 'episodes' && (
          <div className="px-6 lg:px-10 py-8">
            {/* iframe player */}
            {currentEp && currentEmbedSrc ? (
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-8">
                <iframe
                  src={currentEmbedSrc}
                  allowFullScreen
                  className="w-full h-full border-0"
                  title={`${movie.name} - Tập ${currentEp.name}`}
                />
              </div>
            ) : trailerEmbedSrc ? (
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-8">
                <iframe
                  src={trailerEmbedSrc}
                  allowFullScreen
                  className="w-full h-full border-0"
                  title={`${movie.name} - Trailer`}
                />
              </div>
            ) : null}

            {/* Server selector */}
            {servers.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-gray-400 text-sm self-center mr-1">Nguồn:</span>
                {servers.map((server, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedServerIdx(idx); setSelectedEpIdx(0); router.replace(`/phim/${movie.slug}?tap=1&sv=${idx}`); }}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                      selectedServerIdx === idx
                        ? 'bg-[#f472b6] text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {server.server_name}
                  </button>
                ))}
              </div>
            )}

            {/* Episode grid */}
            {currentServer && currentServer.server_data.length > 1 && (
              <>
                <h3 className="text-white font-medium mb-3 text-sm">Chọn tập:</h3>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                  {currentServer.server_data.map((ep, idx) => (
                    <button
                      key={`${idx}-${ep.slug}`}
                      onClick={() => {
                        setSelectedEpIdx(idx);
                        router.replace(`/phim/${movie.slug}?tap=${idx + 1}&sv=${selectedServerIdx}`);
                      }}
                      className={`h-9 rounded-md text-sm font-medium transition ${
                        selectedEpIdx === idx
                          ? 'bg-[#f472b6] text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {ep.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Single movie with no episodes yet */}
            {servers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">Chưa có nguồn phát</p>
                {movie.trailer_url && (
                  <a
                    href={movie.trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-[#f472b6] text-white rounded-lg font-medium hover:opacity-90 transition"
                  >
                    Xem Trailer
                  </a>
                )}
              </div>
            )}

            {/* Available versions summary */}
            {servers.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-white mb-5">Các bản chiếu</h2>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {servers.map((server, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedServerIdx(idx); setSelectedEpIdx(0); setActiveTab('episodes'); router.replace(`/phim/${movie.slug}?tap=1&sv=${idx}`); }}
                      className="relative flex items-center bg-[#5e6070] text-white rounded-xl overflow-hidden hover:opacity-90 transition text-left"
                    >
                      <div
                        className="absolute top-0 bottom-0 right-0 w-[40%] max-w-[130px] z-0"
                        style={{
                          WebkitMaskImage: 'linear-gradient(270deg, black, transparent 95%)',
                          maskImage: 'linear-gradient(270deg, black, transparent 95%)',
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-l from-gray-600 to-transparent" />
                      </div>
                      <div className="relative z-10 w-full p-6 flex flex-col items-start gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-[10px]">#</span>
                          <span>{server.server_name}</span>
                        </div>
                        <div className="font-semibold text-lg leading-snug">
                          {server.server_data.length > 1 ? `${server.server_data.length} tập` : 'Full'}
                        </div>
                        <div className="bg-white text-black text-xs px-3 py-1.5 rounded font-medium">
                          Xem bản này
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Gallery tab ── */}
        {activeTab === 'gallery' && (
          <div className="px-6 lg:px-10 py-8">
            <h2 className="text-xl font-semibold text-white mb-6">Gallery</h2>
            {images?.backdrops && images.backdrops.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.backdrops.slice(0, 12).map((img, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={`${images.image_sizes.backdrop.w780}${img.file_path}`}
                      alt={`${movie.name} - ảnh ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Chưa có hình ảnh</p>
            )}
          </div>
        )}

        {/* ── Từ khóa tab ── */}
        {activeTab === 'keywords' && (
          <div className="px-6 lg:px-10 py-8">
            <h2 className="text-xl font-semibold text-white mb-6">Từ khóa</h2>
            {keywords?.keywords && keywords.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keywords.keywords.map((kw) => (
                  <span
                    key={kw.tmdb_keyword_id}
                    className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-gray-300 hover:bg-white/20 transition cursor-default border border-white/10"
                  >
                    {kw.name_vn || kw.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Không có từ khóa</p>
            )}
          </div>
        )}

        {/* ── Đề xuất tab ── */}
        {activeTab === 'suggestion' && (
          <div className="px-6 lg:px-10 py-8">
            <p className="text-gray-400">Đang cập nhật...</p>
          </div>
        )}

        <hr className="border-white/5 mx-6 lg:mx-10" />
        <CommentSection />
      </div>
    </div>
  );
};

export default MovieMainContent;