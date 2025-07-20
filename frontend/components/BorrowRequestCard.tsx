import {BorrowRequest} from "@/types";
import {ArrowRight, BadgeCheck, CalendarCheck, CheckIcon, Clock, Mail, UserRound, XCircle} from "lucide-react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface BorrowRequestCardProps {
    request: BorrowRequest;
    isOwner?: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onReturn?: () => void;
    onRequestReturn?: () => void;
}

export default function BorrowRequestCard({
                                              request,
                                              isOwner,
                                              onApprove,
                                              onReject,
                                              onReturn,
    onRequestReturn
                                          }: BorrowRequestCardProps) {
    const {
        bookTitle,
        borrowerName,
        borrowerEmail,
        borrowerImageUrl,
        requestDate,
        dueDate,
        status,
    } = request;

    const statusColor : {
        [key: string]: string;
    }= {
        PENDING: "text-yellow-500",
        APPROVED: "text-green-600",
        REJECTED: "text-red-500",
        RETURNED: "text-gray-500",
        RETURN_REQUESTED: "text-blue-500"
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 flex flex-col gap-4 transition hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-semibold text-purple-700">{bookTitle}</h3>
                <span className={cn("text-sm font-semibold", statusColor[status])}>
          {status}
        </span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
                <Image
                    src={borrowerImageUrl}
                    alt="Borrower"
                    width={40}
                    height={40}
                    className="rounded-full border"
                />
                <div>
                    <p className="text-sm text-purple-900 font-medium flex items-center gap-1">
                        <UserRound className="w-4 h-4" />
                        {borrowerName}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {borrowerEmail}
                    </p>
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    Requested on: {new Date(requestDate).toLocaleDateString("en-GB")}
                </p>
                <p className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-purple-500" />
                    Due by: {new Date(dueDate).toLocaleDateString("en-GB")}
                </p>
            </div>

            {/* Action Buttons */}
            {isOwner && status === "PENDING" && (
                <div className="flex gap-3 mt-2">
                    <Button onClick={onApprove} variant="default" className="bg-green-500 hover:bg-green-600">
                        <BadgeCheck className="w-4 h-4 mr-2" />
                        Approve
                    </Button>
                    <Button onClick={onReject} variant="outline" className="border-red-500 text-red-500 hover:bg-red-100">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                    </Button>
                </div>
            )}

            {isOwner && status === "APPROVED" && (
                <Button onClick={onReturn} variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50 mt-2">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Mark as Returned
                </Button>
            )}

            {!isOwner && status === "APPROVED" && (
                <Button
                    onClick={onRequestReturn}
                    variant="outline"
                    className="text-purple-600 border-purple-300 hover:bg-purple-50 mt-2"
                >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Request Return
                </Button>
            )}

            {isOwner && status === "RETURN_REQUESTED" && (
                <Button onClick={onRequestReturn} variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50 mt-2">
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Approve Return Request
                </Button>
            )}

        </div>
    );
}
