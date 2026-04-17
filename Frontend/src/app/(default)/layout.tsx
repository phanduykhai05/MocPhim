import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import { Preloader } from "@/components/Preloader";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        
        <div className="flex flex-col min-h-screen"> 
            <Preloader />
            <Header />
                <main className="flex-grow">
                    {children}
                </main>
            <Footer />
        </div>
    );
}
