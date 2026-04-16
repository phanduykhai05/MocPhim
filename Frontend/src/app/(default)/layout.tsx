import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
                <main className="flex-grow">
                    {children}
                </main>
            <Footer />
        </div>
    );
}
