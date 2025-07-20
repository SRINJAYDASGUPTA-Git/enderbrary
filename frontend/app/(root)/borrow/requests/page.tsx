'use client';
import React, { useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { BorrowRequest } from '@/types';
import Loader from '@/components/Loader';
import BorrowRequestCard from '@/components/BorrowRequestCard';
import {toast} from "sonner"; // Adjust the path if needed

const BorrowRequests = () => {
    const [borrowRequests, setBorrowRequests] = React.useState<BorrowRequest[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.get('/api/v1/borrow/my-requests');
                if (response.status === 200) {
                    setBorrowRequests(response.data);
                }
            } catch (err: any) {
                console.error(err.message || err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader subtitle="Loading... Please Wait..." />
            </div>
        );
    }

    async function handleReturnRequest(id: string) {
        try{
            const confirmReturnRequest = confirm("Are you sure you want to return this book?")
            if(confirmReturnRequest){
                setLoading(true);
                axiosInstance.patch(`/api/v1/borrow/${id}/return`).then((response) => {
                    if (response.status === 200) {
                        setBorrowRequests((prev) => prev.filter((req) => req.id !== id));
                        toast.success('Return request sent successfully!');
                    }
                })
                    .catch((error) => {
                        console.error('Error approving request:', error);
                        toast.error('Failed to request a return. Please try again.');
                    });
            }
        } catch (error) {
            console.error('Error handling approve:', error);
            toast.error('An error occurred while sending the request.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-24 px-4 md:px-10 max-w-6xl mx-auto">
            <h1 className="text-3xl font-display font-semibold mb-6 text-purple-800">My Borrow Requests</h1>

            {borrowRequests.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {borrowRequests.map((request) => (
                        <BorrowRequestCard
                            key={request.id}
                            request={request}
                            isOwner={false} // Flip to true if the user is the lender
                            onRequestReturn={()=> handleReturnRequest(request.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-purple-700 text-center text-lg mt-10">No borrow requests yet.</p>
            )}
        </div>
    );
};

export default BorrowRequests;
