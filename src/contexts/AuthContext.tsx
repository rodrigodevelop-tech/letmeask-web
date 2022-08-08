import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  Auth,
} from "../services/firebase";
import { createContext, ReactNode, useEffect, useState } from "react";

type UserAuthentication = {
  id: string;
  name: string;
  avatar: string;
};

interface AuthContextType {
  user: UserAuthentication | undefined;
  signWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserAuthentication>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signWithGoogle() {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(Auth, provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, signWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
