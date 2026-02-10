"use client";

import { useState } from 'react';
import { useUser, useCollection } from '@/firebase';
import { ArrowLeft, ArrowRight, BookOpenCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/file-uploader';
import { FlashcardView } from '@/components/flashcard-view';
import { AuthButton } from '@/components/auth-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Deck, Flashcard } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter
} from '@/components/ui/sidebar';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function Home() {
    const { user, loading: userLoading } = useUser();
    const { data: decks, loading: decksLoading } = useCollection<Deck>('decks', user?.uid);
    
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showUploader, setShowUploader] = useState(false);
    const { toast } = useToast();

    const handleDeckSelect = (deckId: string) => {
        const deck = decks?.find(d => d.id === deckId) || null;
        setSelectedDeck(deck);
        setCurrentCardIndex(0);
        setShowUploader(false);
    };

    const handleNewDeck = () => {
        setSelectedDeck(null);
        setCurrentCardIndex(0);
        setShowUploader(true);
    };

    const resetView = () => {
        setSelectedDeck(null);
        setShowUploader(false);
    }
    
    const onDeckCreated = () => {
        toast({ title: "Deck created!", description: "Your new study deck is ready." });
        setShowUploader(false);
    }

    const handleNext = () => {
        if (selectedDeck && currentCardIndex < selectedDeck.cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
        }
    };
    
    const renderContent = () => {
        if (userLoading) {
            return <div className="text-center">Loading...</div>;
        }

        if (!user) {
            return (
                <div className="flex flex-col items-center justify-center h-full animate-in fade-in-50 duration-500">
                    <Card className="max-w-md text-center">
                        <CardHeader>
                            <CardTitle className="text-3xl">Welcome to StudyBuddy</CardTitle>
                            <CardDescription>Please log in to save and manage your study decks.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AuthButton />
                        </CardContent>
                    </Card>
                </div>
            );
        }

        if (showUploader) {
            return (
                <div className="w-full max-w-lg animate-in fade-in-50 duration-500 mx-auto">
                    <FileUploader onDeckCreated={onDeckCreated} />
                </div>
            )
        }
        
        if (selectedDeck) {
            const currentCard = selectedDeck.cards[currentCardIndex];
            return (
                <div className="w-full max-w-2xl flex flex-col items-center animate-in fade-in-50 duration-500 mx-auto">
                    <div className="w-full text-center mb-4">
                        <p className="text-lg font-semibold text-foreground">{selectedDeck.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                            Card {currentCardIndex + 1} / {selectedDeck.cards.length}
                        </p>
                    </div>
                    <FlashcardView
                        key={currentCardIndex}
                        question={currentCard.question}
                        answer={currentCard.answer}
                    />
                    <div className="flex justify-between mt-8 w-full">
                        <Button onClick={handlePrevious} disabled={currentCardIndex === 0} variant="outline" size="lg" className="shadow-sm">
                            <ArrowLeft className="mr-2 h-5 w-5" /> Previous
                        </Button>
                        <Button onClick={handleNext} disabled={currentCardIndex === selectedDeck.cards.length - 1} size="lg" className="shadow-sm bg-accent hover:bg-accent/90 text-accent-foreground">
                            Next <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )
        }

        return (
            <div className="text-center animate-in fade-in-50 duration-500">
                 <div className="flex flex-col items-center justify-center h-full">
                    <BookOpenCheck size={64} className="text-muted-foreground" />
                    <h2 className="text-2xl font-semibold mt-4">No deck selected</h2>
                    <p className="text-muted-foreground mt-2">Select a deck from the sidebar or create a new one to start studying.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen text-foreground">
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={resetView}>
                                 <BookOpenCheck className="h-6 w-6 text-primary" />
                                <h2 className="text-xl font-bold text-foreground tracking-tight">
                                    StudyBuddy
                                </h2>
                            </div>
                        </div>
                    </SidebarHeader>
                    <SidebarContent className="p-0">
                        {user && (
                            <SidebarGroup className="pt-0">
                                <SidebarGroupLabel>Your Decks</SidebarGroupLabel>
                                <SidebarMenu>
                                    {decksLoading && (
                                        <div className="p-2 space-y-1">
                                            <SidebarMenuSkeleton showIcon />
                                            <SidebarMenuSkeleton showIcon />
                                        </div>
                                    )}
                                    {decks?.map((deck) => (
                                        <SidebarMenuItem key={deck.id}>
                                            <SidebarMenuButton 
                                                onClick={() => handleDeckSelect(deck.id)}
                                                isActive={selectedDeck?.id === deck.id}
                                            >
                                                {deck.name}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                    {decks && decks.length === 0 && !decksLoading && (
                                        <p className="text-xs text-muted-foreground px-2">No decks yet. Create one!</p>
                                    )}
                                </SidebarMenu>
                            </SidebarGroup>
                        )}
                    </SidebarContent>
                    {user && (
                         <SidebarFooter>
                             <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={handleNewDeck}>
                                        <PlusCircle />
                                        New Deck
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                             </SidebarMenu>
                        </SidebarFooter>
                    )}
                </Sidebar>
                <SidebarInset>
                    <header className="fixed top-0 right-0 left-0 md:left-auto bg-background/80 backdrop-blur-sm border-b border-border z-10 peer-data-[variant=sidebar]:md:pl-[--sidebar-width] peer-data-[collapsible=icon]:md:pl-[--sidebar-width-icon] transition-all duration-200">
                         <div className="container mx-auto flex justify-between items-center h-16 px-4">
                            <div className="flex items-center gap-3">
                                <SidebarTrigger className="md:hidden" />
                            </div>
                            <AuthButton />
                        </div>
                    </header>
                    <main className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
                        {renderContent()}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
