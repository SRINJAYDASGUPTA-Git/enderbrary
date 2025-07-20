'use client'
import {useUser} from "@/providers/UserContext";
import Loader from "@/components/Loader";
import {toast} from "sonner";

export default function Home() {
    const { user, loading } = useUser();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <Loader subtitle={'Please wait...'}/>
        </div>;
    }
    if (!user) {
        toast.error('You must be logged in to access this page.');
        window.location.replace('/login');
    }
  return (
    <main className={'font-display'}>
      HELLO WORLD
    </main>
  );
}
