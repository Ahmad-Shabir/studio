// src/firebase/error-emitter.ts
type Listener = (error: any) => void;
const listeners: Listener[] = [];

export const errorEmitter = {
  emit(event: string, error: any) {
    if (event === 'permission-error') {
      listeners.forEach(listener => listener(error));
    }
  },
  on(event: string, callback: Listener) {
    if (event === 'permission-error') {
      listeners.push(callback);
    }
  },
  off(event: string, callback: Listener) {
    if (event === 'permission-error') {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  },
};
