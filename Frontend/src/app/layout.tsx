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
        <html lang="vi" className={cn(sora.variable, roboto.variable, "font-sans", geist.variable)} suppressHydrationWarning>
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
