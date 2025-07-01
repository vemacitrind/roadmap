import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      console.warn("⚠️ Failed to parse authUser");
      return null;
    }
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userInfo = {
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || null,
          photoURL: firebaseUser.photoURL || null
        };
        setUser(userInfo);
        localStorage.setItem("authUser", JSON.stringify(userInfo));
        console.log("🔥 Synced Firebase");
      } else {
        setUser(null);
        localStorage.removeItem("authUser");
        console.log("👋 User signed out, removed from localStorage");
      }
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
