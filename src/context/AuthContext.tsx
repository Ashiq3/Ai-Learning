import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { ensureUserProfile } from '../services/examService';
import type { UserProfile, UserRole } from '../types/exam';
import { isInstructorEmail } from '../utils/examLogic';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isInstructor: boolean;
  authReady: boolean;
  authBusy: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) return;
      setUser(nextUser);
      setAuthError(null);

      if (!nextUser) {
        setProfile(null);
        setAuthReady(true);
        return;
      }

      try {
        const synced = await ensureUserProfile(nextUser);
        if (active) {
          setProfile(synced);
        }
      } catch (err) {
        if (active) {
          const message = err instanceof Error ? err.message : 'Unable to sync profile.';
          setAuthError(message);
        }
      } finally {
        if (active) {
          setAuthReady(true);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed before completing login.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError('Browser blocked the Google sign-in popup. Please allow popups for this page.');
      } else {
        setAuthError(
          err instanceof Error ? err.message : 'Google Sign-In failed. Please try again.'
        );
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const signOutUser = async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign-out failed.');
    } finally {
      setAuthBusy(false);
    }
  };

  const isInstructor = Boolean(user && isInstructorEmail(user.email, user.emailVerified));
  const role: UserRole | null = user ? (isInstructor ? 'instructor' : 'student') : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isInstructor,
        authReady,
        authBusy,
        authError,
        clearAuthError: () => setAuthError(null),
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
