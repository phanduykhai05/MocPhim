import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Móc Phim - Xem Phim Online Miễn Phí HD';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f1117 0%, #1a1033 45%, #0d1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(118,75,162,0.45) 0%, transparent 70%)',
          }}
        />
        {/* Glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)',
          }}
        />

        {/* Film strip — top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 36,
            background: '#1e1e2e',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 20,
                borderRadius: 3,
                background: i % 2 === 0 ? '#2a2a3e' : '#0f0f1a',
                marginRight: 12,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
        {/* Film strip — bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 36,
            background: '#1e1e2e',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 20,
                borderRadius: 3,
                background: i % 2 === 0 ? '#2a2a3e' : '#0f0f1a',
                marginRight: 12,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(118,75,162,0.2)',
            border: '1px solid rgba(167,139,250,0.4)',
            borderRadius: 999,
            padding: '6px 20px',
            marginBottom: 28,
          }}
        >
          <span style={{ color: '#a78bfa', fontSize: 16, fontWeight: 600, letterSpacing: 2 }}>
            🎬 XEM PHIM ONLINE MIỄN PHÍ
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: 'white',
              letterSpacing: -2,
              lineHeight: 1,
              textShadow: '0 0 40px rgba(167,139,250,0.6)',
            }}
          >
            Móc Phim
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#94a3b8',
            marginBottom: 40,
            letterSpacing: 0.5,
          }}
        >
          Phim Hay Quá Trời • Cập Nhật Nhanh Nhất 2026
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['HD Vietsub', 'Thuyết Minh', 'Lồng Tiếng', 'Phim Chiếu Rạp'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '10px 22px',
                color: '#e2e8f0',
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
