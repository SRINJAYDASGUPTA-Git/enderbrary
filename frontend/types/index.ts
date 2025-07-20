export interface UserResponse {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    accountLocked: boolean;
    enabled: boolean;
    roles: string[];
    booksPosted: BookResponse[];
    booksLent: BookResponse[];
    booksBorrowed: BookResponse[];
    borrowRequests: BorrowRequestResponse[];
}

export interface BorrowRequestResponse {
    id: string;
    bookId: string;
    bookTitle: string;
    lenderName: string;
    borrowerName: string;
    borrowerEmail: string;
    borrowerImageUrl: string;
    requestDate: string;     // ISO string (e.g., "2025-07-20T10:30:00Z")
    dueDate: string;
    status: string;          // you can also define an enum for stricter typing
}

export interface BookResponse {
    id: string;
    title: string;
    author: string;
    description: string;
    category: string;
    coverUrl: string;
    isAvailable: boolean;
    isArchived: boolean;
    ownerName: string;
    ownerEmail: string;
    ownerImageUrl: string;
}
export interface PaginatedBooks {
    content: BookResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}
export interface BorrowRequest {
    id: string;
    bookId: string;
    bookTitle: string;
    lenderName: string;
    borrowerName: string;
    borrowerEmail: string;
    borrowerImageUrl: string;
    requestDate: string; // ISO string; you can parse to Date if needed
    dueDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | string;
}

export interface Session{
    user:{
        name: string;
        email: string;
        image: string
    };
    expires: string;
}