import Banner from "@/app/(default)/phimmoi/components/Banner";
import Topics from "@/app/(default)/phimmoi/components/Topics";
export default function PhimMoi() {
  return (
    <div className="min-h-screen bg-[#191B24] font-sans text-white selection:bg-[#764ba2] selection:text-white">
      <Banner />
      <Topics />
    </div>
  );
}