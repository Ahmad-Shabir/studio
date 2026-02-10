'use client';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

export const useAuthActions = () => {
    const auth = useAuth();
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google: ", error);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return { signInWithGoogle, logOut };
};
