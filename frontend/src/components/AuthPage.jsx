import { useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const {
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    requestOtp,
    verifyOtp,
  } = useAuth();

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) return alert("Enter email and password");
    setProcessing(true);
    try {
      await loginWithEmail(email, password, rememberMe);

      const user = auth.currentUser;
      if (user) {
        const userInfo = {
          email: user.email,
          uid: user.uid,
          name: user.displayName || null,
        };
        localStorage.setItem("authUser", JSON.stringify(userInfo));
        console.log("✅ Email login user saved to localStorage:", userInfo);
      }
    } catch (e) {
      alert("Invalid email or password");
    } finally {
      setProcessing(false);
    }
  };


  const handleSendOtp = async () => {
    if (!email || !password) return alert("Enter email and password");
    setProcessing(true);
    try {
      const res = await requestOtp(email);
      if (res.status === "sent") {
        setMode("otp");
      } else {
        alert("Failed to send OTP");
      }
    } catch {
      alert("Could not send OTP");
    } finally {
      setProcessing(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) return alert("Enter valid 6-digit OTP");
    setProcessing(true);
    try {
      const res = await verifyOtp(email, otp);
      console.log(JSON.stringify(res))
      if (!res.verified) throw new Error("Invalid OTP");
      await signupWithEmail(email, password, true);
      const user = auth.currentUser;
      if (user) {
        const userInfo = {
          email: user.email,
          uid: user.uid,
          name: user.displayName || null,
        };
        localStorage.setItem("authUser", JSON.stringify(userInfo));
        console.log("✅ OTP user saved to localStorage:", userInfo);
      }
    } catch (e) {
      alert("OTP verification failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleGoogle = async () => {
    setProcessing(true);
    try {
      await loginWithGoogle(rememberMe);
      const user = auth.currentUser;
      if (user) {
      const userInfo = {
        email: user.email,
        uid: user.uid,
        name: user.displayName || null,
      };
      localStorage.setItem("authUser", JSON.stringify(userInfo));
      console.log("✅ Google login user saved to localStorage:", userInfo);
    }
    } catch {
      alert("Google login failed");
    } finally {
      setProcessing(false);
    }
  };

  const title = {
    signin: "Sign In",
    signup: "Sign Up",
    otp: "Enter OTP",
  }[mode];

  return (
    <div className="min-h-screen w-screen grid place-items-center px-4 py-10">
      <Card className="w-full max-w-sm bg-zinc-900/80 border-zinc-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-start text-white text-2xl">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {mode !== "otp" && (
            <>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700"
              />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700"
              />

              {mode === "signin" && (
                <label className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-zinc-300">Remember me</span>
                </label>
              )}
            </>
          )}

          {mode === "otp" && (
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Enter OTP</label>
              <Input
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700"
              />
            </div>
          )}

          {/* Primary Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={processing}
            onClick={
              mode === "signin"
                ? handleEmailSignIn
                : mode === "signup"
                  ? handleSendOtp
                  : handleOtpSubmit
            }
          >
            {processing
              ? "Please wait…"
              : mode === "signin"
                ? "Continue with Email"
                : mode === "signup"
                  ? "Send OTP"
                  : "Verify & Create"}
          </Button>

          {mode === "signin" && (
            <>
              <Separator className="bg-zinc-700" />
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogle}
                disabled={processing}
              >
                <FcGoogle size={20} />
                {processing ? "Please wait…" : "Continue with Google"}
              </Button>
            </>
          )}

          {mode !== "otp" && (
            <p className="text-sm text-center text-zinc-400 pt-2">
              {mode === "signin"
                ? "No account yet?"
                : "Already have an account?"}{" "}
              <button
                className="text-blue-400 hover:underline"
                onClick={() =>
                  setMode(mode === "signin" ? "signup" : "signin")
                }
              >
                {mode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
