'use client';

import Link from 'next/link';
import { BookHeart, Github, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bottom-0 left-0 w-full bg-purple-50 text-purple-800 border-t border-purple-200 px-6 py-10 text-sm font-display z-50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Left - Logo or text */}
                <div className="flex items-center gap-2">
                    <BookHeart className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">EnderBrary</span>
                </div>

                {/* Center - Links */}
                <div className="flex gap-4 items-center">
                    <Link href="/about" className="hover:underline hover:text-purple-600 transition">About</Link>
                    <Link href="/books" className="hover:underline hover:text-purple-600 transition">Explore</Link>
                    <Link href="/contact" className="hover:underline hover:text-purple-600 transition">Contact</Link>
                </div>

                {/* Right - Socials or credit */}
                <div className="flex items-center gap-3 text-purple-500">
                    <a href="mailto:dasguptasrinjay2004@gmail.com" className="hover:text-purple-700 transition">
                        <Mail className="w-4 h-4" />
                    </a>
                    <a href="https://github.com/SRINJAYDASGUPTA-Git/enderbrary" target="_blank" className="hover:text-purple-700 transition">
                        <Github className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Bottom message */}
            <div className="text-center text-xs text-purple-400 mt-6">
                Made with ☕ and 📚 in the End — © {new Date().getFullYear()} EnderBrary
            </div>
        </footer>
    );
}
