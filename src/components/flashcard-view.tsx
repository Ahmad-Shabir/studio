"use client";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface FlashcardViewProps {
    question: string;
    answer: string;
}

export function FlashcardView({ question, answer }: FlashcardViewProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setIsFlipped(false);
    }, [question]);

    return (
        <div 
            className="w-full h-80 [perspective:1000px] cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsFlipped(!isFlipped) }}
            aria-label={`Flashcard. Question: ${question}. Click or press enter to reveal answer.`}
        >
            <div
                className={cn(
                    "relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d]",
                    isFlipped && "[transform:rotateY(180deg)]"
                )}
            >
                {/* Front of the card */}
                <div className="absolute w-full h-full [backface-visibility:hidden] flex p-1">
                    <Card className="w-full h-full flex flex-col items-center justify-center p-6 text-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Question</p>
                        <p className="text-2xl md:text-3xl font-bold text-card-foreground">{question}</p>
                    </Card>
                </div>
                {/* Back of the card */}
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex p-1">
                    <Card className="w-full h-full flex flex-col items-center justify-center p-6 text-center shadow-xl bg-secondary">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Answer</p>
                        <p className="text-2xl md:text-3xl font-bold text-secondary-foreground">{answer}</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
