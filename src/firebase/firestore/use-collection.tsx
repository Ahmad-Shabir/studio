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
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T>(path: string, uid?: string | null) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  const collectionQuery = useMemo(() => {
    if (!uid) return null;
    return query(collection(firestore, 'users', uid, path)) as Query<DocumentData>;
  }, [firestore, path, uid]);

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
          path: (collectionQuery as any)._path.segments.join('/'),
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error("Error fetching collection: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionQuery]);

  return { data, loading };
}
