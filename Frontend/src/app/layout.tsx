import type { Metadata } from "next";
import { Roboto, Sora } from "next/font/google";
import "@/styles/globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const roboto = Roboto({
    subsets: ["vietnamese"],
    variable: "--font-roboto",
});

const sora = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
});

export const metadata: Metadata = {
    title: "Phim Mới Nhất - Xem Phim Online Miễn Phí",
    description: "Móc Phim - Phim Hay Chảy Nước",
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
        <html lang="vi" className={`${sora.variable} ${roboto.variable}`}>
            <body className="antialiased">
                <ScrollToTop />
                {children}
            </body>
        </html>
    );
}
