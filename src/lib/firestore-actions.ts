'use client';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Flashcard } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Helper to get App ID safely
const getAppId = () => {
  if (typeof window !== 'undefined') {
    return (window as any).__app_id || 'studybuddy-default';
  }
  return 'studybuddy-default';
};

export const useDeckActions = () => {
    const firestore = useFirestore();

    const addDeck = (uid: string, name: string, cards: Flashcard[]) => {
        if (!name.trim()) {
            throw new Error("Deck name cannot be empty.");
        }
        
        const appId = getAppId();
        // Updated path to use mandatory artifacts structure
        const path = `artifacts/${appId}/users/${uid}/decks`;
        const decksCollection = collection(firestore, path);
        
        return addDoc(decksCollection, {
            name,
            cards,
            userId: uid,
            createdAt: serverTimestamp(),
        }).catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: path,
                operation: 'create',
                requestResourceData: { name, cards }
            }));
            throw err;
        });
    };

    return { addDeck };
};