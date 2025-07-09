import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { fetchUserProfile } from "@/lib/userProfile";

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
  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const profile = await fetchUserProfile(firebaseUser.uid);

        const userInfo = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: profile?.name || firebaseUser.displayName || "Anonymous",
          photoURL: profile?.profileLink || firebaseUser.photoURL || null,
          ...profile,
        };

        setUser(userInfo);
        localStorage.setItem("authUser", JSON.stringify(userInfo));
        console.log("🔥 Synced Firebase + Firestore profile");
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
        setUser(null);
      }
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
