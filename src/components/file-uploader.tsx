"use client";

import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from '@/components/ui/input';
import type { Flashcard } from '@/types';

interface FileUploaderProps {
    onCardsParsed: (cards: Flashcard[]) => void;
}

export function FileUploader({ onCardsParsed }: FileUploaderProps) {
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setError(null);
            parseCsv(file);
        }
    };
    
    const handleAreaClick = () => {
        fileInputRef.current?.click();
    };

    const parseCsv = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                if (lines.length < 2) {
                    throw new Error("CSV must have a header row and at least one data row.");
                }

                const header = lines[0].split(',').map(h => h.trim().toLowerCase());
                const questionIndex = header.indexOf('question');
                const answerIndex = header.indexOf('answer');

                if (questionIndex === -1 || answerIndex === -1) {
                    throw new Error("CSV header must contain 'question' and 'answer' columns.");
                }

                const cards: Flashcard[] = lines.slice(1).map((line) => {
                    const values = line.split(',');
                    const question = values[questionIndex]?.trim();
                    const answer = values[answerIndex]?.trim();

                    if (!question || !answer) {
                        return null;
                    }

                    return { question, answer };
                }).filter((card): card is Flashcard => card !== null);
                
                if(cards.length === 0){
                    throw new Error("No valid flashcards found in the file.");
                }

                onCardsParsed(cards);
            } catch (err: any) {
                setError(err.message || "Failed to parse CSV file.");
                setFileName(null);
            }
        };
        reader.onerror = () => {
            setError("Error reading the file.");
            setFileName(null);
        };
        reader.readAsText(file);
    };

    return (
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <CardTitle className="text-3xl">Upload Your Study Deck</CardTitle>
                <CardDescription>Select a CSV file with 'question' and 'answer' columns to begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div 
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                    onClick={handleAreaClick}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAreaClick() }}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload CSV file"
                >
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        {fileName ? (
                            <span className="font-semibold text-foreground flex items-center gap-2"><FileText className="h-5 w-5" />{fileName}</span>
                        ) : (
                            "Click to browse or drop a file here"
                        )}
                    </p>
                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Upload Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="text-left text-xs text-muted-foreground pt-2 bg-muted p-3 rounded-md">
                    <p className="font-semibold mb-1">Example CSV format:</p>
                    <code className="block bg-background px-2 py-1 rounded text-[10px] whitespace-pre">question,answer
What is the capital of France?,Paris
Which planet is known as the Red Planet?,Mars</code>
                </div>
            </CardContent>
        </Card>
    );
}
