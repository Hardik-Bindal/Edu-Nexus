import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// We need a service account JSON for firebase-admin.
// If the user hasn't provided one, we can either ask for it, 
// or for a hackathon/MVP, we can just decode the JWT without full verification
// using jsonwebtoken, OR we can just trust the email sent from frontend (less secure)
// Since we have the Firebase config from frontend, but not Admin SDK config...
// Let's implement a safe-ish decode first.

export const verifyGoogleToken = async (idToken) => {
  // To properly verify, we need Firebase Admin SDK initialized with serviceAccountKey.json
  // Since we don't have it, we'll try to verify it gracefully or fallback to decoding if admin fails
  try {
     if (admin.apps.length === 0) {
       // Try to initialize without cert if default credentials exist, otherwise this will throw
       admin.initializeApp({
         projectId: process.env.FIREBASE_PROJECT_ID || 'manas-b210c'
       });
     }
     const decodedToken = await admin.auth().verifyIdToken(idToken);
     return decodedToken;
  } catch (error) {
     console.error("Firebase Admin verification failed. Make sure GOOGLE_APPLICATION_CREDENTIALS is set.");
     throw new Error("Invalid or expired Google Token");
  }
}
