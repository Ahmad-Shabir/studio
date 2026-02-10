'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';


export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        // Create or update user profile in Firestore
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }, { merge: true });
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, loading };
}
