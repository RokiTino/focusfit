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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { auth } from '@/lib/firebase';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID || '',
});

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
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) {
        throw new Error('No ID token received from Google');
      }

      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(userInfo.data.idToken);

      // Sign in with Firebase
      const result = await signInWithCredential(auth, googleCredential);

      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

      return { error: null, isNewUser };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return { error: error as Error, isNewUser: false };
    }
  };

  const signInWithApple = async () => {
    try {
      // Check if Apple Authentication is available on this device
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Sign-In is only available on iOS devices');
      }

      // Start Apple Authentication
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Create OAuth provider for Apple
      const provider = new OAuthProvider('apple.com');
      const oauthCredential = provider.credential({
        idToken: credential.identityToken!,
      });

      // Sign in with Firebase
      const result = await signInWithCredential(auth, oauthCredential);

      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

      return { error: null, isNewUser };
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      return { error: error as Error, isNewUser: false };
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
