'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axiosInstance';
import { toast } from 'sonner';
import Loader from "@/components/Loader";

export default function OAuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const finalizeOAuth = async () => {
            try {
                const res = await fetch('/api/auth/session');
                if (!res.ok) {
                    throw new Error('No session found');
                }

                const session = await res.json();

                const response = await axios.post('/api/v1/auth/oauth2/login', {
                    ...session.user,
                });

                if (response.status === 201) {
                    router.replace('/activate');
                } else if (response.status === 200) {
                    localStorage.setItem('accessToken', response.data.access_token);
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                    toast.success('Authentication successful!');
                    window.location.replace('/');
                }
            } catch (err) {
                console.error(err);
                toast.error('OAuth failed. Try logging in again.');
                router.replace('/login');
            }
        };

        finalizeOAuth();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <Loader subtitle={'Authenticating...'} />
        </div>
    );
}
