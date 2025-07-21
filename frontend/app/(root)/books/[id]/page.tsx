'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import axios from '@/utils/axiosInstance';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {useUser} from '@/providers/UserContext';
import {BookResponse} from '@/types';
import {Archive, Ban, CheckCircle2, Pencil} from 'lucide-react';
import BookDetailsSkeleton from "@/components/BookDetailsSkeleton";
import {toast} from "sonner";

export default function BookDetailsPage() {
    const { id } = useParams();
    const { user } = useUser();
    const [book, setBook] = useState<BookResponse | null>(null);
    const [loading, setLoading] = useState(true);
    if(!user){
        toast.error('You must be logged in to edit a book');
        window.location.replace('/login');
    }
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`/api/v1/books/${id}`);
                setBook(res.data);
            } catch (err) {
                console.error('Failed to fetch book:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    if (loading || !book) {
        return <BookDetailsSkeleton />;
    }

    const isOwner = user?.email === book.ownerEmail;

    async function handleArchive(id: string) {
        if (confirm('Are you sure you want to archive this book?')) {
            const response = await axios.patch(`/api/v1/books/${id}/archive`);
            const data = response.data;
            if (data.status === 'success') {
                const updatedRes = await axios.get(`/api/v1/books/${id}`);
                setBook(updatedRes.data);
            }
            else {
                console.error('Failed to archive book:', data.message);
            }
        }

    }

    async function handleBorrowRequest(id: any) {
        try {
            setLoading(true);
            const response = await axios.post(`/api/v1/borrow/${id}`);
            if(response.status === 200) {
                toast.success('Borrow requests sent successfully!');
            } else {
                toast.error('Failed to send borrow requests. Please try again.');
            }
        } catch (error) {
            console.error('Error sending borrow requests:', error);
            toast.error('An error occurred while sending the borrow requests.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Title */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
                <h1 className="text-3xl font-display font-semibold text-purple-800">
                    {book.title}
                </h1>
                <div className="flex gap-3 mt-4 sm:mt-0">
                    {book.isArchived ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">
              <Ban size={16} /> Archived
            </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
              <CheckCircle2 size={16} /> Active
            </span>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-10">
                {/* Cover */}
                <div className="w-full md:w-1/3">
                    <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-purple-200 shadow">
                        <Image
                            src={book.coverUrl}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h2 className="text-lg font-medium text-purple-700">Author</h2>
                        <p className="text-gray-700">{book.author}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-medium text-purple-700">Category</h2>
                        <p className="text-gray-700">{book.category}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-medium text-purple-700">Description</h2>
                        <p className="text-gray-700">{book.description}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-medium text-purple-700">Owner</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <Image
                                src={book.ownerImageUrl}
                                alt={book.ownerName}
                                width={32}
                                height={32}
                                className="rounded-full border"
                            />
                            <span className="text-sm text-gray-800">{book.ownerName}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 flex gap-4 flex-wrap">
                        {isOwner ? (
                            <>
                                <Button variant="outline">
                                    <Pencil className="w-4 h-4 mr-2" /> Edit Book
                                </Button>
                                {!book.isArchived && (
                                    <Button variant="ghost" className="text-red-500 hover:text-red-700" onClick={()=>handleArchive(book.id)}>
                                        <Archive className="w-4 h-4 mr-2" /> Archive
                                    </Button>
                                )}
                            </>
                        ) : (
                            book.isAvailable && !book.isArchived && (
                                <Button className="bg-purple-500 hover:bg-purple-600 text-white" onClick={()=> handleBorrowRequest(book.id)}>
                                    Request to Borrow
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
