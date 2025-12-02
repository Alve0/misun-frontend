import { createContext, type ReactNode, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../../firebase";

// Define the shape of your auth context
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  signout: () => Promise<void>;
  googleLogin: () => Promise<UserCredential>;
  resetPass: (email: string) => Promise<void>;
  profileUpdate: (name: string, photo: string) => Promise<void>;
}

// Create context with proper type and default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// AuthProvider component
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Create user
  const createUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const Googleprovider = new GoogleAuthProvider();
  const googleLogin = () => {
    return signInWithPopup(auth, Googleprovider);
  };

  // Sign out
  const signout = () => {
    return signOut(auth);
  };

  // Reset password
  const resetPass = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const profileUpdate = async (name: string, photo: string) => {
    if (!auth.currentUser) {
      throw new Error("No user is currently signed in");
    }

    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });

    // Update local state
    setUser({
      ...auth.currentUser,
      displayName: name,
      photoURL: photo,
    });
  };

  // Monitor auth state
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const authData: AuthContextType = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    login,
    signout,
    googleLogin,
    resetPass,
    profileUpdate,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
