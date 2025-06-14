import { auth } from "@/firebase/config";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { saveUserIfNew } from "@/lib/firebaseUser";

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  const signupWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserIfNew(result.user);
    return result.user;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserIfNew(result.user);
    return result.user;
  };

  return {
    signupWithEmail,
    loginWithGoogle,
  };
}
