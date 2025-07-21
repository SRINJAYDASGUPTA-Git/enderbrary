'use client';

import { useEffect, useState } from 'react';
import { PaginatedBooks } from '@/types';
import axios from '@/utils/axiosInstance';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {useUser} from "@/providers/UserContext";

export default function ExplorePage() {
    const [books, setBooks] = useState<PaginatedBooks | null>(null);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const size = 8;
    const {user, loading: userLoading} = useUser();

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(0); // Reset to first page on new search
            setDebouncedSearch(search);
        }, 500); // 500ms debounce

        return () => clearTimeout(handler);
    }, [search]);

    // Fetch books when page or debouncedSearch changes
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get(
                    `/api/v1/books/search?keyword=${encodeURIComponent(debouncedSearch)}&page=${page}&size=${size}`
                );
                if(user && !userLoading) {
                    const currentUserId = user.email;
                    console.log(currentUserId)

                    const filteredBooks = {
                        ...res.data,
                        content: res.data.content.filter((book: any) => book.ownerEmail !== currentUserId),
                    };
                    setBooks(filteredBooks);
                } else {
                    setBooks(res.data);
                }

            } catch (err) {
                console.error('Failed to load books:', err);
            }
        };

        fetchBooks();
    }, [page, debouncedSearch, user, userLoading]);
    
    if(userLoading)
        return <div className="text-center mt-10">Loading user...</div>;
    if (!books) return <div className="text-center mt-10">Loading books...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 bg-purple-50 sm:px-8 pt-12 pb-12 text-purple-900 font-display h-fit">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-semibold">📚 Explore Books</h1>
                <Input
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:max-w-sm bg-white border-purple-300 text-purple-900"
                />
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.content.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>

            <div className="flex justify-center gap-4">
                <Button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={books.first}
                    variant="outline"
                >
                    Previous
                </Button>
                <span className="text-purple-700 font-medium self-center">
          Page {books.page + 1} of {books.totalPages}
        </span>
                <Button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={books.last}
                    variant="outline"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
