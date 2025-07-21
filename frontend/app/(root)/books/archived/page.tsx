'use client'
import React, {useEffect, useState} from 'react';
import {useUser} from "@/providers/UserContext";
import {BookResponse} from "@/types";
import {useRouter} from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/Loader";
import {BookCard} from "@/components/BookCard";
import axios from "@/utils/axiosInstance";
import {toast} from "sonner";

const ArchivedBooks = () => {
    const {user, loading} = useUser();
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const router = useRouter();

    if(!user){
        toast.error('You must be logged in to edit a book');
        window.location.replace('/login');
    }
    useEffect(() => {
        const fetchBooks = async () => {
            if (!user) return;
            setLoadingBooks(true);
            try {
                const response = await axiosInstance.get(`/api/v1/books/me/archived`);
                if (response.status !== 200) throw new Error('Failed to fetch books');
                const data = await response.data;
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoadingBooks(false);
            }
        };

        fetchBooks();
    }, [user]);

    if (loading || loadingBooks) {
        return <div className="flex items-center justify-center min-h-screen">
            <Loader subtitle={'Please wait...'}/>
        </div>;
    }

    console.log(books)

    async function handleUnarchive(id: string) {
        if (confirm('Are you sure you want to unarchive this book?')) {
            const response = await axios.patch(`/api/v1/books/${id}/unarchive`);
            const data = response.data;
            if (data.status === 'success') {
                const updatedRes = await axios.get(`/api/v1/books/${id}`);
                setBooks(prevBooks => [...prevBooks, updatedRes.data]);
            }
            else {
                console.error('Failed to archive book:', data.message);
            }
        }
    }

    return (
        <div className={'mt-10 font-bold text-center flex flex-col  w-full text-black h-screen'}>
            <span className={'text-3xl font-semibold mb-5'}>My Archived Books</span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
                {books.length > 0 ? (
                    books.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onEdit={() => router.push(`/books/${book.id}/edit`)}
                            onArchive={()=> handleUnarchive(book.id)}
                            onClick={() => router.push(`/books/${book.id}`)}
                        />

                    ))
                ) : (
                    <p className="text-gray-500">You have no books.</p>
                )}
            </div>
        </div>
    );
};

export default ArchivedBooks;
