import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  sendPasswordResetEmail,
  linkWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { auth } from '@/lib/firebase';

// Lazy import Google Sign-In to prevent crashes when native module isn't available
let GoogleSignin: any = null;
let isGoogleSignInAvailable = false;

try {
  // Only import if the module is available
  const GoogleSignInModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = GoogleSignInModule.GoogleSignin;

  // Configure Google Sign-In
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID || '',
  });
  isGoogleSignInAvailable = true;
  console.log('[Auth] Google Sign-In module loaded successfully');
} catch (error) {
  console.warn('[Auth] Google Sign-In module not available. This is expected in Expo Go. Use a development build for social auth.');
  isGoogleSignInAvailable = false;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInAsGuest: () => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null; isNewUser?: boolean }>;
  signInWithApple: () => Promise<{ error: Error | null; isNewUser?: boolean }>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: Error | null }>;
  linkAnonymousAccount: (email: string, password: string) => Promise<{ error: Error | null }>;
  isAnonymous: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('[Google Sign-In] Starting authentication flow...');

      // Check if Google Sign-In module is available
      if (!isGoogleSignInAvailable || !GoogleSignin) {
        throw new Error('Google Sign-In is not available. Please use a development build or production build. This feature does not work in Expo Go.');
      }

      // Check if device supports Google Play Services
      console.log('[Google Sign-In] Checking for Google Play Services...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('[Google Sign-In] Google Play Services available');

      // Get user info from Google
      console.log('[Google Sign-In] Requesting user sign-in...');
      const userInfo = await GoogleSignin.signIn();
      console.log('[Google Sign-In] User info received:', userInfo.data?.user?.email);

      if (!userInfo.data?.idToken) {
        const errorMsg = 'No ID token received from Google. Please check your Firebase Web Client ID configuration.';
        console.error('[Google Sign-In]', errorMsg);
        throw new Error(errorMsg);
      }

      // Create Firebase credential
      console.log('[Google Sign-In] Creating Firebase credential...');
      const googleCredential = GoogleAuthProvider.credential(userInfo.data.idToken);

      // Sign in with Firebase
      console.log('[Google Sign-In] Signing in with Firebase...');
      const result = await signInWithCredential(auth, googleCredential);
      console.log('[Google Sign-In] Successfully signed in:', result.user.email);

      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      console.log('[Google Sign-In] Is new user:', isNewUser);

      return { error: null, isNewUser };
    } catch (error: any) {
      console.error('[Google Sign-In] Error occurred:', error);
      console.error('[Google Sign-In] Error code:', error.code);
      console.error('[Google Sign-In] Error message:', error.message);

      // Provide user-friendly error messages
      let userMessage = 'Unable to sign in with Google. ';
      if (error.code === '12501') {
        userMessage += 'Sign-in was cancelled.';
      } else if (error.code === 'auth/invalid-credential') {
        userMessage += 'Invalid credentials. Please check your Firebase configuration.';
      } else if (error.message?.includes('ID token')) {
        userMessage += 'Configuration error. Please contact support.';
      } else if (error.message?.includes('Play Services')) {
        userMessage += 'Google Play Services is required but not available.';
      } else {
        userMessage += error.message || 'Please try again.';
      }

      const enhancedError = new Error(userMessage);
      (enhancedError as any).originalError = error;
      return { error: enhancedError, isNewUser: false };
    }
  };

  const signInWithApple = async () => {
    try {
      console.log('[Apple Sign-In] Starting authentication flow...');

      // Check if Apple Authentication is available on this device
      if (Platform.OS !== 'ios') {
        const errorMsg = 'Apple Sign-In is only available on iOS devices';
        console.error('[Apple Sign-In]', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[Apple Sign-In] Checking availability...');
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        const errorMsg = 'Apple Sign-In is not available on this device. Requires iOS 13+.';
        console.error('[Apple Sign-In]', errorMsg);
        throw new Error(errorMsg);
      }

      // Start Apple Authentication
      console.log('[Apple Sign-In] Requesting user sign-in...');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log('[Apple Sign-In] Credential received');

      if (!credential.identityToken) {
        const errorMsg = 'No identity token received from Apple';
        console.error('[Apple Sign-In]', errorMsg);
        throw new Error(errorMsg);
      }

      // Create OAuth provider for Apple
      console.log('[Apple Sign-In] Creating Firebase credential...');
      const provider = new OAuthProvider('apple.com');
      const oauthCredential = provider.credential({
        idToken: credential.identityToken,
      });

      // Sign in with Firebase
      console.log('[Apple Sign-In] Signing in with Firebase...');
      const result = await signInWithCredential(auth, oauthCredential);
      console.log('[Apple Sign-In] Successfully signed in:', result.user.uid);

      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      console.log('[Apple Sign-In] Is new user:', isNewUser);

      return { error: null, isNewUser };
    } catch (error: any) {
      console.error('[Apple Sign-In] Error occurred:', error);
      console.error('[Apple Sign-In] Error code:', error.code);
      console.error('[Apple Sign-In] Error message:', error.message);

      // Provide user-friendly error messages
      let userMessage = 'Unable to sign in with Apple. ';
      if (error.code === 'ERR_CANCELED' || error.code === '1001') {
        userMessage += 'Sign-in was cancelled.';
      } else if (error.code === 'auth/invalid-credential') {
        userMessage += 'Invalid credentials. Please try again.';
      } else if (error.message?.includes('not available')) {
        userMessage += error.message;
      } else if (error.message?.includes('identity token')) {
        userMessage += 'Authentication failed. Please try again.';
      } else {
        userMessage += error.message || 'Please try again.';
      }

      const enhancedError = new Error(userMessage);
      (enhancedError as any).originalError = error;
      return { error: enhancedError, isNewUser: false };
    }
  };

  const linkAnonymousAccount = async (email: string, password: string) => {
    try {
      if (!user || !user.isAnonymous) {
        throw new Error('No anonymous user to link');
      }

      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(user, credential);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInAsGuest,
    signInWithGoogle,
    signInWithApple,
    signOut,
    sendPasswordReset,
    linkAnonymousAccount,
    isAnonymous: user?.isAnonymous || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
