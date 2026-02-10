'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from '@/firebase';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const firebaseInstances = useMemo(() => {
    try {
      return initializeFirebase();
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      return { error: message };
    }
  }, []);

  if (!firebaseInstances || 'error' in firebaseInstances) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <div className="text-center rounded-lg border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-destructive">Firebase Error</h1>
          <p className="mt-2 text-muted-foreground">Could not connect to Firebase.</p>
          <pre className="mt-4 w-[400px] whitespace-pre-wrap rounded-md bg-slate-950 p-4 text-left text-sm text-white">
            <code>{firebaseInstances?.error || 'Unknown initialization error.'}</code>
          </pre>
        </div>
      </div>
    );
  }

  return <FirebaseProvider value={firebaseInstances}>{children}</FirebaseProvider>;
}
