import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;
let adminStorage: admin.storage.Storage | null = null;

if (typeof window === 'undefined') {
  const hasCreds = 
    process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_CLIENT_EMAIL && 
    process.env.FIREBASE_PRIVATE_KEY;

  if (hasCreds) {
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
          databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
        console.log('[Firebase Admin] Initialized successfully');
      } catch (error) {
        console.error('[Firebase Admin] Initialization error:', error);
      }
    }
  } else {
    console.warn('[Firebase Admin] Credentials missing. Running in mock/build mode.');
  }

  if (admin.apps.length) {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
    adminStorage = admin.storage();
  }
}

// Export safe variables (cast to their types to avoid TS compilation issues in other files)
export const db = adminDb as admin.firestore.Firestore;
export const auth = adminAuth as admin.auth.Auth;
export const storage = adminStorage as admin.storage.Storage;
export { adminDb, adminAuth, adminStorage, admin };
