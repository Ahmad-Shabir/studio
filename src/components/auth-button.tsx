'use client';
import { useUser } from '@/firebase/auth/use-user';
import { useAuthActions } from '@/firebase/auth/actions';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogIn, LogOut } from 'lucide-react';

export function AuthButton() {
    const { user, loading } = useUser();
    const { signInWithGoogle, logOut } = useAuthActions();

    if (loading) {
        return <Button variant="ghost" size="icon" disabled className="animate-pulse" />;
    }

    if (!user) {
        return (
            <Button onClick={signInWithGoogle}>
                <LogIn className="mr-2" />
                Login
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => logOut()}>
                    <LogOut className="mr-2" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
