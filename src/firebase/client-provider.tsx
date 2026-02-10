'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from '@/firebase';
import { FirebaseProvider } from './provider';
import { Loader2 } from 'lucide-react';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const firebaseInstances = useMemo(() => {
    try {
      return initializeFirebase();
    } catch (error: any) {
      // Handle the specific loading signal from index.ts
      if (error.message === 'CONFIG_LOADING') {
        return { loading: true };
      }
      console.error("Firebase initialization failed:", error);
      return { error: error.message || "An unknown error occurred." };
    }
  }, []);

  // Show a loading spinner if the config is still being injected
  if ('loading' in firebaseInstances) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium text-center">
            Initializing StudyBuddy...
          </p>
        </div>
      </div>
    );
  }

  if ('error' in firebaseInstances) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="text-center rounded-lg border bg-card p-8 shadow-sm max-w-md">
          <h1 className="text-2xl font-bold text-destructive">Connection Error</h1>
          <p className="mt-2 text-muted-foreground">Could not connect to the database.</p>
          <pre className="mt-4 w-full whitespace-pre-wrap rounded-md bg-slate-950 p-4 text-left text-xs text-white">
            <code>{firebaseInstances.error}</code>
          </pre>
        </div>
      </div>
    );
  }

  return <FirebaseProvider value={firebaseInstances as any}>{children}</FirebaseProvider>;
}