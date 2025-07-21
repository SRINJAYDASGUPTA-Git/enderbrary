import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomeLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full flex flex-col items-center justify-between min-h-screen bg-gray-50">
            <div className="flex items-center justify-center w-full max-w-6xl mx-auto">
                <Navbar/>
                <div className="md:mt-20 flex w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
            <Footer/>
        </div>
    );
}
