import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * GLOBAL VARIABLE DECLARATIONS
 * These variables are provided by the environment at runtime.
 */
declare global {
  interface Window {
    __firebase_config?: string;
    __app_id?: string;
    __initial_auth_token?: string;
  }
  const __firebase_config: string | undefined;
  const __app_id: string | undefined;
  const __initial_auth_token: string | undefined;
}

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseInstances: FirebaseInstances | null = null;

/**
 * INITIALIZATION LOGIC
 */
export function initializeFirebase(): FirebaseInstances {
  if (firebaseInstances) {
    return firebaseInstances;
  }

  // Attempt to resolve config from globals or window
  let configStr = typeof __firebase_config !== 'undefined' ? __firebase_config : undefined;
  
  // Fallback to window check if the global constant isn't bound yet
  if (!configStr && typeof window !== 'undefined') {
    configStr = window.__firebase_config;
  }

  if (!configStr) {
    // Instead of throwing immediately, we return a "mock" or log clearly.
    // In this specific environment, throwing crashes the preview.
    console.warn("Firebase configuration not yet available. Waiting for injection...");
    // We throw a specific message that the ClientProvider can catch gracefully
    throw new Error('CONFIG_LOADING');
  }

  const config = JSON.parse(configStr);

  if (!config.apiKey) {
    throw new Error('Firebase API Key missing in config.');
  }

  const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // RULE 3: Auth Before Queries
  const initAuth = async () => {
    try {
      const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : window.__initial_auth_token;
      if (token) {
        await signInWithCustomToken(auth, token);
      } else {
        await signInAnonymously(auth);
      }
    } catch (error) {
      console.error("Firebase Auth initialization failed:", error);
    }
  };

  initAuth();

  firebaseInstances = { app, auth, firestore };
  return firebaseInstances;
}

// Export a getter for config to ensure it always evaluates at runtime
export const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config || '{}') : {};

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './auth/actions';