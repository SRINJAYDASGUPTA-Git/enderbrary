import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomeLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full flex flex-col items-center justify-center h-screen p-6">
            <Navbar />
            <div className="mt-40">
            {children}
            </div>
            <Footer />
        </div>
    );
}
