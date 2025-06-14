import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
export default function Login() {
  const { signupWithEmail, loginWithGoogle } = useAuth();

  const handleEmailSignup = () => signupWithEmail("test@example.com", "password123");
  const handleGoogleSignup = () => loginWithGoogle();

  return (
    <>
      <Button onClick={handleEmailSignup}>Signup with Email</Button>
      <Button onClick={handleGoogleSignup}>Signup with Google</Button>
    </>
  );
}
