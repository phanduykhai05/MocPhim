import type { Metadata } from "next";
import { Roboto, Sora, Geist } from "next/font/google";
import "@/styles/globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeInitializer from "@/components/ThemeInitializer";
import NavigationScrollFix from "@/components/NavigationScrollFix";
import SecurityGuard from "@/components/SecurityGuard";
import AntdProvider from "@/components/AntdProvider";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const roboto = Roboto({ subsets: ["vietnamese"], variable: "--font-roboto" });
const sora   = Sora({ subsets: ["latin"], variable: "--font-sora" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL  || 'https://moc-phim.vercel.app';
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL  || 'http://localhost:8080';

interface SiteMeta {
  siteTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultKeywords: string;
  canonicalDomain: string;
  autoOpenGraph: boolean;
  autoTwitterCard: boolean;
}

async function fetchSiteMeta(): Promise<SiteMeta | null> {
  try {
    const res = await fetch(`${AUTH_URL}/api/v1/seo/meta`, {
      next: { tags: ['seo-meta'], revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await fetchSiteMeta();

  const title       = meta?.siteTitle        ?? "Móc Phim - Xem Phim Online Miễn Phí HD 2026";
  const template    = meta?.titleTemplate    ?? "%s | Móc Phim";
  const description = meta?.defaultDescription ?? "Móc Phim - Xem phim online miễn phí chất lượng HD. Cập nhật phim mới nhất 2026.";
  const keywords    = meta?.defaultKeywords  ?? "xem phim online, phim mới nhất, phim miễn phí, phim vietsub";
  const canonical   = meta?.canonicalDomain  ?? SITE_URL;

  return {
    metadataBase: new URL(canonical),
    title:       { default: title, template },
    description,
    keywords:    keywords.split(",").map((k) => k.trim()),
    authors:     [{ name: "Móc Phim" }],
    creator:     "Móc Phim",
    publisher:   "Móc Phim",
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: { canonical },
    ...(meta?.autoOpenGraph !== false && {
      openGraph: {
        type: "website", locale: "vi_VN",
        url: canonical, siteName: "Móc Phim",
        title, description,
      },
    }),
    ...(meta?.autoTwitterCard !== false && {
      twitter: {
        card: "summary_large_image",
        title, description,
      },
    }),
    icons: { icon: "/favicon.ico" },
  };
}


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className={cn(sora.variable, roboto.variable, "font-sans", geist.variable)} suppressHydrationWarning>
            <head>
                {/* Runs before first paint to avoid dark/light flash */}
                <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('theme')!=='light'){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
            </head>
            <body className="antialiased">
                <ThemeInitializer />
                <SecurityGuard />
                <ScrollToTop />
                <NavigationScrollFix />
                <AntdProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </AntdProvider>
            </body>
        </html>
    );
}
