import Navbar from "@/components/Navbar";

export default function HomeLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full flex items-center justify-center h-screen p-6">
            <Navbar />
            {children}
        </div>
    );
}
