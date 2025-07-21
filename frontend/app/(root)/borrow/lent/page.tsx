'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { BorrowRequest, BookResponse } from '@/types';
import Loader from '@/components/Loader';
import { BookCard } from '@/components/BookCard';
import { CalendarDays } from 'lucide-react';
import {useUser} from "@/providers/UserContext";
import {toast} from "sonner";

interface EnrichedRequest {
    request: BorrowRequest;
    book: BookResponse;
}

const LentBooks = () => {
    const [enrichedData, setEnrichedData] = useState<EnrichedRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const {user, loading: userLoading} = useUser();
    useEffect(() => {
        if (!userLoading && !user) {
            toast.error('You must be logged in to edit a book');
            window.location.replace('/login');
        }
    }, [userLoading, user]);
    useEffect(() => {
        const fetchLentBooks = async () => {
            try {
                const res = await axiosInstance.get<BorrowRequest[]>('/api/v1/borrow/my-requests/approved');

                if (res.status === 200) {
                    const requests = res.data;

                    const enriched: EnrichedRequest[] = await Promise.all(
                        requests.map(async (req) => {
                            try {
                                const bookRes = await axiosInstance.get<BookResponse>(`/api/v1/books/${req.bookId}`);
                                return { request: req, book: bookRes.data };
                            } catch (err) {
                                console.error('Failed to fetch book for request:', req.id);
                                return null as any;
                            }
                        })
                    );

                    // Filter out any nulls
                    setEnrichedData(enriched.filter(Boolean));
                }
            } catch (err: any) {
                console.error(err.message || err);
            } finally {
                setLoading(false);
            }
        };

        fetchLentBooks();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader subtitle="Fetching lent books..." />
            </div>
        );
    }

    return (
        <div className="mt-24 px-4 md:px-10 max-w-6xl mx-auto h-screen">
            <h1 className="text-3xl font-display font-semibold mb-6 text-purple-800">
                Books You've Lent
            </h1>

            {enrichedData.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {enrichedData.map(({ request, book }) => (
                        <BookCard
                            key={request.id}
                            book={book}
                            extraInfo={
                                <div className="text-sm text-purple-700 space-y-1">
                                    <p>
                                        <span className="font-medium">To:</span> {request.borrowerName}
                                    </p>
                                    <p className="flex items-center">
                                        <CalendarDays className="w-4 h-4 mr-1" />
                                        Due: {new Date(request.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                            }
                        />
                    ))}
                </div>
            ) : (
                <p className="text-purple-700 text-center text-lg mt-10">
                    You haven’t lent any books yet.
                </p>
            )}
        </div>
    );
};

export default LentBooks;
