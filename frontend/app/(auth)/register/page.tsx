'use client';

import { Eye, EyeClosed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from "@/utils/axiosInstance";
import OAuthSignInButton from "@/components/OAuthSignInButton";
import Loader from "@/components/Loader";
import { Session } from "@/types";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch('/api/auth/session');
                if (!res.ok) return setSession(null);
                const sessionData = await res.json();
                setSession(sessionData);
            } catch (err) {
                console.error('Error fetching session:', err);
            }
        };
        fetchSession();
    }, []);

    useEffect(() => {
        if (session?.user) {
            window.location.replace('/');
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { email, password, name };

        try {
            setLoading(true);
            const res = await axios.post('/api/v1/auth/register', payload);
            const data = await res.data;

            if (res.status === 201) {
                router.push('/activate');
            } else {
                console.error('Registration failed:', data.message);
            }
        } catch (err) {
            console.error('Error during registration:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader subtitle="Registering..." />;

    return (
        <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md mx-auto mt-20 p-8 bg-white border border-purple-200 shadow-xl rounded-2xl space-y-6 text-gray-800 font-sans"
        >
            <h2 className="text-3xl font-display font-bold text-center text-purple-700">
                Create an Account
            </h2>

            {/* OAuth buttons */}
            <div className="flex gap-4 justify-center items-center flex-col md:flex-row">
                <OAuthSignInButton provider="google" />
                <OAuthSignInButton provider="github" />
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        className="p-2 mt-1 block w-full rounded-md bg-purple-50 border border-purple-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="p-2 mt-1 block w-full rounded-md bg-purple-50 border border-purple-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="p-2 mt-1 block w-full rounded-md bg-purple-50 border border-purple-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-purple-600"
                        >
                            {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="p-2 mt-1 block w-full rounded-md bg-purple-50 border border-purple-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 pr-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-purple-600"
                        >
                            {showConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md font-display font-semibold transition"
                >
                    Register
                </button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-purple-500 hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </form>
    );
}
