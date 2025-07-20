'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useUser} from "@/providers/UserContext";
import {UserButton} from "@/components/UserButton";

export default function Navbar() {
    const { user, loading } = useUser();
    if (loading) return null;

    return (
        <>
            {/* Sticky wrapper */}
            <div className="fixed top-0 left-0 w-full z-50">
                {/* ✨ Pastel glow behind navbar */}
                <div
                    className="absolute top-0 left-0 w-full h-24 bg-purple-300 blur-[100px] opacity-30 pointer-events-none"
                    style={{ animation: 'pulse 6s ease-in-out infinite' }}
                />

                {/* 🧭 Navbar */}
                <nav
                    className="relative px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-purple-200 shadow-md"
                    style={{
                        boxShadow: '0 8px 24px rgba(192, 132, 252, 0.15)',
                    }}
                >
                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src="/logo-full.svg"
                            alt="Enderbrary Logo"
                            width={120}
                            height={100}
                            className="cursor-pointer"
                        />
                    </Link>

                    {/* Auth buttons */}
                    {
                        user && user.name !== 'Temporary User' ? (
                            <UserButton />
                        ) : (
                            <div className="space-x-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 border border-purple-300 text-purple-600 rounded-xl hover:bg-purple-100 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-400 transition"
                                >
                                    Signup
                                </Link>
                            </div>
                        )
                    }
                </nav>

                {/*/!* 🌸 Sparkle magic bar *!/*/}
                {/*<div className="relative w-full h-24 -mt-1 z-10">*/}
                {/*    <SparklesCore*/}
                {/*        background="transparent"*/}
                {/*        minSize={0.4}*/}
                {/*        maxSize={2}*/}
                {/*        particleDensity={300}*/}
                {/*        className="w-full h-full"*/}
                {/*        particleColor="#c084fc" // pastel purple sparkles*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
        </>
    );
}
