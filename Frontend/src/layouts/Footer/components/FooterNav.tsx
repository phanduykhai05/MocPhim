import Link from "next/link";

export default function FooterNav() {
    const navLinks = [
        { label: "Hỏi-Đáp", url: "https://rophims.vip/hoi-dap" },
        { label: "Chính sách bảo mật", url: "https://rophims.vip/chinh-sach-bao-mat" },
        { label: "Điều khoản sử dụng", url: "https://rophims.vip/dieu-khoan-su-dung" },
        { label: "Giới thiệu", url: "https://rophims.vip/gioi-thieu" },
        { label: "Liên hệ", url: "https://rophims.vip/lien-he" },
    ];

    return (
        <nav className="flex flex-wrap gap-6 mb-6 justify-center md:justify-start">
            {navLinks.map((link) => (
                <a
                    key={link.label}
                    href={link.url}
                    className="text-white hover:text-[#FFD875] text-sm font-medium transition-colors whitespace-nowrap"
                >
                    {link.label}
                </a>
            ))}
        </nav>
    );
}
