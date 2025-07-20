'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axiosInstance';
import Loader from '@/components/Loader';
import {BookCard} from '@/components/BookCard';
import { BookResponse } from '@/types';
import { Input } from '@/components/ui/input';

export default function ExplorePage() {
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('/api/v1/books');
                setBooks(res.data);
            } catch (err) {
                console.error('Error fetching books:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mt-60 min-h-screen bg-purple-50 px-6 sm:px-10 pt-24 pb-12 text-purple-900 font-display">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-3xl font-semibold">📚 Explore Books</h1>
                    <Input
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:max-w-sm bg-white border-purple-300 text-purple-900"
                    />
                </div>

                {loading ? (
                    <div className="pt-20">
                        <Loader subtitle="Fetching stories from the shelves..." />
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))
                        ) : (
                            <p className="text-center col-span-full text-purple-400">
                                No books found. Try another search!
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
