import FooterBrand from "@/layouts/Footer/components/FooterBrand";
import FooterNav from "@/layouts/Footer/components/FooterNav";
import FooterAbout from "@/layouts/Footer/components/FooterAbout";
import FooterBottom from "@/layouts/Footer/components/FooterBottom";
import images from "@/assets/images";
import Image from "next/image";
export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#e9edf5] dark:bg-[#0F111A] text-gray-700 dark:text-[#a0a4b8] font-sans border-t border-gray-300 dark:border-[#1f2333] transition-colors duration-300">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[3] pointer-events-none block z-0">
                <Image src={images.Footericon} alt="Footer Icon" className="w-full h-full object-contain" />
            </div>

            {/* Main Container */}
            <div className="max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] w-full mx-auto px-5 xl:px-[50px] 3xl:px-[80px] 4xl:px-[120px] relative z-10">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between py-8 xl:py-12 gap-8 xl:min-h-[400px]">
                    {/* Left Section */}
                    <div className="flex flex-col flex-grow">
                        {/* Brand */}
                        <FooterBrand />

                        {/* Navigation */}
                        <FooterNav />

                        {/* About */}
                        <FooterAbout />
                    </div>

                    {/* Right Section */}
                    <div className="w-full xl:w-auto xl:min-w-[260px] flex flex-col xl:h-full xl:justify-between xl:self-stretch">
                        <div className="space-y-0.5 text-center text-[14px] leading-relaxed text-gray-500 dark:text-[#85899b] xl:text-left xl:self-start">
                            <p><i>--------Developer--------</i></p>
                            <p>FullStack Phan Duy Khai</p>
                            <p>BackEnd Vo Ho Vinh Khang.</p>
                            <p>TestTer Tran Thi Bich Ngoc</p>
                            <p>BA Nguyen Gia Huy</p>
                            <p><i>--------Developer--------</i></p>
                        </div>

                        <FooterBottom />
                    </div>
                </div>
            </div>
        </footer>
    );
}
