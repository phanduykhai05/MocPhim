import Link from "next/link";
import Image from "next/image";
import images from "@/assets/images";

export default function FooterBrand() {
    const socialLinks = [
        { name: "Telegram", url: "https://t.me/congdongrophim", icon: "telegram" },
        { name: "Discord", url: "https://discord.gg/rophim", icon: "discord" },
        { name: "X", url: "https://x.com/rophimtv", icon: "x" },
        { name: "Facebook", url: "https://www.facebook.com/rogiaitri", icon: "facebook-icon" },
        { name: "Tiktok", url: "https://www.tiktok.com/@rophimtv", icon: "tiktok-icon-dark" },
        { name: "Youtube", url: "https://www.youtube.com/@rophimcom", icon: "youtube" },
    ];

    return (
        <div className="flex flex-col max-w-[800px] items-center md:items-start md:mx-0 mx-auto">
            {/* Vietnam Flag & Message */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8c1010] text-white text-[13px] md:text-sm font-medium">
                    <div className="w-5 h-5 flex-shrink-0">
                        <Image src={images.vn_flag} alt="Vietnam" className="w-full h-full object-contain" loading="lazy" decoding="async"/>
                    </div>
                    <span>Hoàng Sa &amp; Trường Sa là của Việt Nam!</span>
                </div>
            </div>

            {/* Logo & Social */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 mb-8 justify-center md:justify-start items-center md:items-center">
                <Link href="/phimmoi" className="block flex-shrink-0 hover:opacity-80 transition-opacity">
                    <img
                        src="https://rophims.vip/wp-content/themes/rophim/assets/images/logo.svg"
                        alt="RoPhim"
                        className="h-[48px] md:h-[60px] w-auto"
                        loading="lazy"
                        decoding="async"
                    />
                </Link>

                {/* Social Icons */}
                <div className="flex flex-wrap items-center gap-3 md:pl-10 md:border-l border-[#2d3142]">
                    {socialLinks.map((social) => (
                        <a
                            key={social.name}
                            target="_blank"
                            href={social.url}
                            title={social.name}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <img
                                src={`https://svgl.app/library/${social.icon}.svg`}
                                alt={social.name}
                                className="w-5 h-5"
                                loading="lazy"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
