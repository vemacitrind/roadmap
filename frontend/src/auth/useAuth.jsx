import { useState, useEffect, useCallback } from "react";
import { auth } from "@/firebase/config";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { saveUserIfNew } from "@/lib/firebaseUser";

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyPersistence = useCallback(
    async (remember) => {
      const mode = remember ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, mode);
    },
    []
  );

  const signupWithEmail = async (email, password, remember = false) => {
    await applyPersistence(remember);
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserIfNew(fbUser);
    setUser(fbUser);
    return fbUser;
  };

  const loginWithEmail = async (email, password, remember = false) => {
    await applyPersistence(remember);
    const { user: fbUser } = await signInWithEmailAndPassword(auth, email, password);
    setUser(fbUser);
    return fbUser;
  };

  const loginWithGoogle = async (remember = false) => {
    await applyPersistence(remember);
    const { user: fbUser } = await signInWithPopup(auth, googleProvider);
    await saveUserIfNew(fbUser);
    setUser(fbUser);
    return fbUser;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Python API's
  const baseURL = "http://localhost:5000/auth";

   const requestOtp = async (email) =>
    fetch(`${baseURL}/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email }),
    }).then((res) => res.json());

   const verifyOtp = async (email, otp) =>
    fetch(`${baseURL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    }).then((res) => res.json());

  return {
    user,
    loading,
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    requestOtp,
    verifyOtp
  };
}
