import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseInstances: FirebaseInstances | null = null;

export function initializeFirebase(): FirebaseInstances {
  if (firebaseInstances) {
    return firebaseInstances;
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  firebaseInstances = { app, auth, firestore };
  return firebaseInstances;
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './auth/actions';
