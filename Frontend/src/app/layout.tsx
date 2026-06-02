import type { Metadata } from "next";
import { Roboto, Sora, Geist } from "next/font/google";
import "@/styles/globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeInitializer from "@/components/ThemeInitializer";
import SecurityGuard from "@/components/SecurityGuard";
import AntdProvider from "@/components/AntdProvider";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const roboto = Roboto({
    subsets: ["vietnamese"],
    variable: "--font-roboto",
});

const sora = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moc-phim.vercel.app';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Móc Phim - Xem Phim Online Miễn Phí HD 2026",
        template: "%s | Móc Phim",
    },
    description: "Móc Phim - Xem phim online miễn phí chất lượng HD. Cập nhật phim mới nhất 2026, phim bộ, phim lẻ, phim chiếu rạp. Vietsub, thuyết minh, lồng tiếng.",
    keywords: ["xem phim online", "phim mới nhất", "phim miễn phí", "phim vietsub", "phim thuyết minh", "phim hd", "phim bộ", "phim lẻ", "móc phim"],
    authors: [{ name: "Móc Phim" }],
    creator: "Móc Phim",
    publisher: "Móc Phim",
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: {
        canonical: SITE_URL,
    },
    openGraph: {
        type: "website",
        locale: "vi_VN",
        url: SITE_URL,
        siteName: "Móc Phim",
        title: "Móc Phim - Xem Phim Online Miễn Phí HD 2026",
        description: "Xem phim online miễn phí chất lượng HD. Cập nhật phim mới nhất 2026, phim bộ, phim lẻ, phim chiếu rạp.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Móc Phim - Xem Phim Online Miễn Phí HD 2026",
        description: "Xem phim online miễn phí chất lượng HD. Cập nhật phim mới nhất 2026.",
    },
    icons: {
        icon: "/favicon.ico",
    },
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className={cn(sora.variable, roboto.variable, "font-sans", geist.variable)} suppressHydrationWarning>
            <head>
                {/* Chạy trước render để tránh flash trắng — mặc định dark nếu chưa chọn light */}
                <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('theme')!=='light'){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
            </head>
            <body className="antialiased">
                <ThemeInitializer />
                <SecurityGuard />
                <ScrollToTop />
                <AntdProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </AntdProvider>
            </body>
        </html>
    );
}
