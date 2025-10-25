'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, displayName: string): Promise<void> {
    // CRITICAL: We return the promise here so the calling component can await it and handle errors.
    return createUserWithEmailAndPassword(authInstance, email, password)
        .then(userCredential => {
            // After user is created, update their profile with the display name.
            if (userCredential.user) {
                return updateProfile(userCredential.user, { displayName });
            }
        });
}


/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  // CRITICAL: We return the promise so the calling component can await it and handle errors.
  return signInWithEmailAndPassword(authInstance, email, password).then(() => {});
}

/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
    const provider = new GoogleAuthProvider();
    // CRITICAL: We return the promise so the calling component can await it and handle errors.
    return signInWithPopup(authInstance, provider).then(() => {});
}
