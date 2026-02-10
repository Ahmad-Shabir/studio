"use client";

import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/file-uploader';
import { FlashcardView } from '@/components/flashcard-view';
import type { Flashcard } from '@/types';

export default function Home() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const handleCardsParsed = (cards: Flashcard[]) => {
        setFlashcards(cards);
        setCurrentCardIndex(0);
    };
    
    const resetApp = () => {
        setFlashcards([]);
        setCurrentCardIndex(0);
    }

    const handleNext = () => {
        if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
        }
    };
    
    return (
        <div className="bg-background min-h-screen text-foreground">
            <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
                <div className="container mx-auto flex justify-between items-center h-16 px-4">
                    <div className="flex items-center gap-3">
                         <BookOpen className="h-7 w-7 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">
                            StudyBuddy
                        </h1>
                    </div>
                    {flashcards.length > 0 && (
                        <Button variant="ghost" onClick={resetApp}>New Deck</Button>
                    )}
                </div>
            </header>
            <main className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-4">
                {flashcards.length === 0 ? (
                    <div className="w-full max-w-lg animate-in fade-in-50 duration-500">
                        <FileUploader onCardsParsed={handleCardsParsed} />
                    </div>
                ) : (
                    <div className="w-full max-w-2xl flex flex-col items-center animate-in fade-in-50 duration-500">
                        <div className="w-full text-center mb-4">
                            <p className="text-sm text-muted-foreground font-medium">
                                Card {currentCardIndex + 1} / {flashcards.length}
                            </p>
                        </div>
                        <FlashcardView
                            key={currentCardIndex}
                            question={flashcards[currentCardIndex].question}
                            answer={flashcards[currentCardIndex].answer}
                        />
                        <div className="flex justify-between mt-8 w-full">
                            <Button onClick={handlePrevious} disabled={currentCardIndex === 0} variant="outline" size="lg" className="shadow-sm">
                                <ArrowLeft className="mr-2 h-5 w-5" /> Previous
                            </Button>
                            <Button onClick={handleNext} disabled={currentCardIndex === flashcards.length - 1} size="lg" className="shadow-sm bg-accent hover:bg-accent/90 text-accent-foreground">
                                Next <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
