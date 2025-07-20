'use client';

import {useRouter} from 'next/navigation';
import {useUser} from '@/providers/UserContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {BookAIcon, BookOpenIcon, HandHelpingIcon, InboxIcon, LibraryBig, LogOut, Settings} from 'lucide-react';
import {signOut} from "next-auth/react";

export const UserButton = () => {
    const { user, setUser } = useUser();
    const router = useRouter();

    if (!user || user.name === 'Temporary User') return null;

    const handleLogout = async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        await signOut();

        setUser(null);
        router.push('/login');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.imageUrl} alt={user.name} />
                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push('/profile-settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push('/books/me')}>
                    <LibraryBig className="mr-2 h-4 w-4" />
                    <span>My Books</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push('/books/archived')}>
                    <BookAIcon className="mr-2 h-4 w-4" />
                    <span>My Archived Books</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Borrow Requests</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => router.push('/borrow/requests')}>
                    <BookOpenIcon className="mr-2 h-4 w-4" />
                    <span>My Borrow Requests</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push('/borrow/lent')}>
                    <HandHelpingIcon className="mr-2 h-4 w-4" />
                    <span>Books I Lent</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push('/borrow/incoming')}>
                    <InboxIcon className="mr-2 h-4 w-4" />
                    <span>Incoming Requests</span>
                </DropdownMenuItem>



                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
