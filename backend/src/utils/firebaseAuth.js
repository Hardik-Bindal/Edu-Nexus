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
  try {
    if (admin.apps.length === 0) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Firebase Admin verification failed:", error);
    throw new Error("Invalid or expired Google Token");
  }
};
