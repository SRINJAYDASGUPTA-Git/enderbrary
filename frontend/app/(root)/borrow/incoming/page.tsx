'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { BorrowRequest } from '@/types';
import BorrowRequestCard from '@/components/BorrowRequestCard';
import Loader from '@/components/Loader';
import {toast} from "sonner";
import {useUser} from "@/providers/UserContext";

const IncomingBorrowRequests = () => {
    const [requests, setRequests] = useState<BorrowRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const {user, loading: userLoading} = useUser();
    if(!user){
        toast.error('You must be logged in to edit a book');
        window.location.replace('/login');
    }
    useEffect(() => {
        const fetchIncoming = async () => {
            try {
                const res = await axiosInstance.get('/api/v1/borrow/incoming-requests');
                if (res.status === 200) {
                    setRequests(res.data);
                }
            } catch (err: any) {
                console.error(err.message || err);
            } finally {
                setLoading(false);
            }
        };

        fetchIncoming();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader subtitle="Loading Incoming Requests..." />
            </div>
        );
    }

    function handleApprove(id: string) {
        try{
            const confirmApprove = confirm('Are you sure you want to approve this borrow request?');
            if (confirmApprove) {
                setLoading(true);
                axiosInstance.patch(`/api/v1/borrow/${id}/approve`)
                    .then((response) => {
                        if (response.status === 200) {
                            setRequests((prev) => prev.filter((req) => req.id !== id));
                            toast.success('Borrow request approved successfully!');
                        }
                    })
                    .catch((error) => {
                        console.error('Error approving request:', error);
                        toast.error('Failed to approve the request. Please try again.');
                    });
            }
        } catch (error) {
            console.error('Error handling approve:', error);
            toast.error('An error occurred while approving the request.');
        } finally {
            setLoading(false);
        }
    }

    function handleConfirmReturn(id: string) {
        try{
            const confirmApproveReturn = confirm("Are you sure you want to confirm the return of this book?")
            if(confirmApproveReturn){
                setLoading(true);
                axiosInstance.patch(`/api/v1/borrow/${id}/complete-return`).then((response) => {
                    if (response.status === 200) {
                        setRequests((prev) => prev.filter((req) => req.id !== id));
                        toast.success('Return confirmed successfully!');
                    }
                })
                    .catch((error) => {
                        console.error('Error approving request:', error);
                        toast.error('Failed to confirm a return. Please try again.');
                    });
            }
        } catch (error) {
            console.error('Error handling approve:', error);
            toast.error('An error occurred while confirming the return.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-24 px-4 md:px-10 max-w-6xl mx-auto h-screen">
            <h1 className="text-3xl font-display font-semibold mb-6 text-purple-800">
                Incoming Borrow Requests
            </h1>

            {requests.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {requests.map((request) => (
                        <BorrowRequestCard key={request.id} request={request} isOwner={true} onApprove={()=> handleApprove(request.id)} onRequestReturn={()=> handleConfirmReturn(request.id)}/>
                    ))}
                </div>
            ) : (
                <p className="text-purple-700 text-center text-lg mt-10">
                    No incoming borrow requests yet.
                </p>
            )}
        </div>
    );
};

export default IncomingBorrowRequests;
