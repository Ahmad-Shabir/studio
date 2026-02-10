'use client';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Flashcard } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export const useDeckActions = () => {
    const firestore = useFirestore();

    const addDeck = (uid: string, name: string, cards: Flashcard[]) => {
        if (!name.trim()) {
            throw new Error("Deck name cannot be empty.");
        }
        const decksCollection = collection(firestore, 'users', uid, 'decks');
        return addDoc(decksCollection, {
            name,
            cards,
            userId: uid,
            createdAt: serverTimestamp(),
        }).catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: `users/${uid}/decks`,
                operation: 'create',
                requestResourceData: { name, cards }
            }));
            throw err;
        });
    };

    return { addDeck };
};
