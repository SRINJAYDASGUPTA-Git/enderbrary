'use client'
import {Archive, Ban, CheckCircle2, Pencil} from "lucide-react";
import { Button } from "./ui/button";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useUser} from "@/providers/UserContext";
import {BookResponse} from "@/types";
import Image from "next/image";
interface BookCardProps {
    book: BookResponse;
    onEdit?: () => void;
    onArchive?: () => void;
    onClick?: () => void;
    extraInfo?: React.ReactNode; // ⬅️ New optional prop
}

export const BookCard = ({ book, onEdit, onArchive, onClick, extraInfo }: BookCardProps) => {
    const { user } = useUser();
    const router = useRouter();
    const isOwner = user?.email === book.ownerEmail;

    return (
        <div
            className={cn(
                'bg-white rounded-xl shadow hover:shadow-md transition p-4 border border-purple-100 flex flex-col items-center text-center',
                book.isArchived && window.location.pathname !== '/books/archived' && 'opacity-60'
            )}
        >
            {/* Cover */}
            <div className="relative w-full h-64 rounded-md overflow-hidden mb-4">
                <Image
                    src={book.coverUrl || '/placeholder.png'}
                    alt={book.title}
                    fill
                    className="object-cover"
                    onClick={onClick || (() => router.push(`/books/${book.id}`))}
                />
            </div>

            {/* Info */}
            <h3 className="text-lg font-display font-semibold text-purple-800 line-clamp-1">
                {book.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">by {book.author}</p>
            <p className="text-sm text-gray-700 line-clamp-3">{book.description}</p>

            {/* ✨ Borrow context display */}
            {extraInfo && (
                <div className="mt-3 text-sm text-purple-700 text-left w-full">
                    {extraInfo}
                </div>
            )}

            {/* Status */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
                {book.isArchived ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-md">
            <Ban size={14} /> Archived
          </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-md">
            <CheckCircle2 size={14} /> Active
          </span>
                )}
                {!book.isAvailable && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-md">
            Borrowed
          </span>
                )}
            </div>

            {/* Actions */}
            {isOwner && (
                <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={onEdit} className="text-sm cursor-pointer">
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    {!book.isArchived ? (
                        <Button
                            variant="ghost"
                            onClick={onArchive}
                            className="text-sm text-red-500 hover:text-red-700"
                        >
                            <Archive className="w-4 h-4 mr-1" /> Archive
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={onArchive}
                            className="text-sm text-green-500 hover:text-green-700"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Unarchive
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
