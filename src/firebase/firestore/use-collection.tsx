'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  onSnapshot,
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
// Using local relative imports (same directory) to avoid resolution issues
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * GLOBAL VARIABLE DECLARATIONS
 */
declare global {
  interface Window {
    __app_id?: string;
  }
}

const getAppId = () => {
  if (typeof window !== 'undefined') {
    return window.__app_id || 'studybuddy-default';
  }
  return 'studybuddy-default';
};

export function useCollection<T>(collectionName: string, uid?: string | null) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  const collectionQuery = useMemo(() => {
    if (!uid) return null;
    
    const appId = getAppId();
    
    /**
     * MANDATORY RULE 1: Strict Paths
     * Pattern: /artifacts/{appId}/users/{userId}/{collectionName}
     */
    const path = `artifacts/${appId}/users/${uid}/${collectionName}`;
    return query(collection(firestore, path)) as Query<DocumentData>;
  }, [firestore, collectionName, uid]);

  useEffect(() => {
    if (!collectionQuery) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      collectionQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: collectionName,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error("Firestore access error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionQuery, collectionName]);

  return { data, loading };
}