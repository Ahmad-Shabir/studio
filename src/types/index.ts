import type { Timestamp } from 'firebase/firestore';

export interface Flashcard {
    question: string;
    answer: string;
}

export interface Deck {
    id: string;
    name: string;
    cards: Flashcard[];
    userId: string;
    createdAt: Timestamp;
}
