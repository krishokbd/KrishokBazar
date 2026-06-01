/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Detect if are using the placeholder credentials or real project keys
export let isFirebaseConfigured = 
  !!(firebaseConfig && 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'dummy-api-key-for-building-only');

let firebaseApp;
let firestoreDb;
let firebaseAuth;

if (isFirebaseConfigured) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Resilient Firestore initialization
    try {
      if (firebaseConfig.firestoreDatabaseId) {
        firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
      } else {
        firestoreDb = getFirestore(firebaseApp);
      }
    } catch (firestoreError) {
      console.warn("Firestore with custom ID failed or unavailable. Retrying with default ID...", firestoreError);
      try {
        firestoreDb = getFirestore(firebaseApp);
      } catch (defaultFirestoreError) {
        console.error("Firestore is completely unavailable on this Firebase project:", defaultFirestoreError);
        throw defaultFirestoreError;
      }
    }

    firebaseAuth = getAuth(firebaseApp);
    
    // Asynchronously validate live backend connectivity
    const testConnection = async () => {
      try {
        if (firestoreDb) {
          await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
          console.log("Firebase Connection verified successfully.");
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration or connection status.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.error("Error initializing live Firebase application SDK. Reverting to local state fallback:", err);
    isFirebaseConfigured = false;
    firestoreDb = undefined;
    firebaseAuth = undefined;
  }
}

// Fallbacks if not connected
export const app = firebaseApp;
export const db = firestoreDb;
export const auth = firebaseAuth;

// Reusable Firestore hardener errors
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  console.error('[DATABASE INTEGRITY ALERT] Firestore execution failed:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}
