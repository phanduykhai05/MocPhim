import Banner from "@/app/(default)/phimmoi/components/Banner";
import Topics from "@/app/(default)/phimmoi/components/Topics";
import { TopSeriesList } from "@/app/(default)/phimmoi/components/TopseriCard";
import { DottedMap, type Marker } from "@/components/ui/dotted-map";
import { NewUpdateList } from "@/app/(default)/phimmoi/components/MovieUpdate";
import HappyMovie from "@/app/(default)/phimmoi/components/HappyMovie";
type VietnamMarker = Marker & {
  overlay: {
    label: string;
  };
};

export default function PhimMoi() {
  const markers: VietnamMarker[] = [
    {
      // Vietnam center approximation for map pinning
      lat: 16.047079,
      lng: 108.20623,
      size: 0.8,
      pulse: true,
      overlay: {
        label: "FPT Hồ Chí Minh",
      },
    },
    {
      // Hanoi, Vietnam
      lat: 41.0278,
      lng: 105.8342,
      size: 0.8,
      pulse: true,
      overlay: {
        label: "Server Hà Nội",
      },
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#191B24] font-sans text-white selection:bg-[#764ba2] selection:text-white">
      <Banner />
      <Topics />
      <NewUpdateList />
      <HappyMovie />
      <TopSeriesList />
      <div className="relative z-30 isolate -mt-6 h-[220px] w-full overflow-hidden sm:h-[280px] md:mt-0 md:h-[400px]">
        <DottedMap<VietnamMarker>
          className="relative z-10 h-full w-full text-[#5f6987]"
          markers={markers}
          markerColor="#22c55e"
          pulse
          renderMarkerOverlay={({ marker, x, y }) => (
            <g transform={`translate(${x + 1.4} ${y - 1.8})`} pointerEvents="none">
              <rect x="1.1" y="-1.15" width="3.2" height="2.2" rx="0.35" fill="#da251d" />
              <text x="2.7" y="0.45" textAnchor="middle" fill="#ffde00" fontSize="1.1" fontWeight="700">★</text>
              <text
                x="5.9"
                y="0.85"
                fill="#ffffff"
                fontSize="2.15"
                fontWeight="700"
                letterSpacing="0.28"
                stroke="#0b0f18"
                strokeWidth="0.22"
                paintOrder="stroke"
                style={{ fontFamily: "var(--font-sora), var(--font-roboto), sans-serif" }}
              >
                {marker.overlay.label}
              </text>
            </g>
          )}
        />
      </div>
    </div>
    
  );
}