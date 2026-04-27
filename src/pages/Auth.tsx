import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Shield, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { signUpSchema, signInSchema } from "@/lib/validators";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const Auth = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Sharp! Logging you in...");
    navigate("/dashboard");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      firstName: fd.get("firstName") as string,
      lastName: fd.get("lastName") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      idNumber: fd.get("idNumber") as string,
      dateOfBirth: fd.get("dateOfBirth") as string,
      password: fd.get("password") as string,
      confirmPassword: fd.get("confirmPassword") as string,
      acceptTerms: fd.get("acceptTerms") === "on",
    };
    const parsed = signUpSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
          phone: parsed.data.phone,
          id_number: parsed.data.idNumber,
          date_of_birth: parsed.data.dateOfBirth,
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome to eKasiBets! R150 bonus credited 🎉");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-1 mb-6">
          <span className="font-display text-3xl gradient-text">e</span>
          <span className="font-display text-3xl text-foreground">KASI</span>
          <span className="font-display text-3xl gradient-text">BETS</span>
        </Link>

        <div className="card-premium p-6 md:p-8">
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Join Free
            </button>
          </div>

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <h1 className="font-display text-2xl mb-2">Welcome back, mfana!</h1>
              <p className="text-sm text-muted-foreground mb-4">Log in to continue betting</p>
              <div>
                <Label htmlFor="si-email">Email</Label>
                <Input id="si-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div>
                <Label htmlFor="si-pwd">Password</Label>
                <div className="relative">
                  <Input
                    id="si-pwd"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="btn-kasi w-full">
                {submitting ? "Logging in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <h1 className="font-display text-2xl mb-2">Join the eKasi family 🎉</h1>
              <p className="text-sm text-muted-foreground mb-4">
                R150 welcome bonus + lifetime perks
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>

              <div>
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" name="email" type="email" required />
              </div>

              <div>
                <Label htmlFor="phone">Phone (SA)</Label>
                <Input id="phone" name="phone" placeholder="0821234567" required />
              </div>

              <div>
                <Label htmlFor="idNumber">SA ID Number</Label>
                <Input id="idNumber" name="idNumber" maxLength={13} required />
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth (18+)</Label>
                <Input id="dob" name="dateOfBirth" type="date" required />
              </div>

              <div>
                <Label htmlFor="su-pwd">Password</Label>
                <Input
                  id="su-pwd"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  required
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  8+ chars, 1 uppercase, 1 number
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPwd">Confirm Password</Label>
                <Input
                  id="confirmPwd"
                  name="confirmPassword"
                  type={showPwd ? "text" : "password"}
                  required
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox id="acceptTerms" name="acceptTerms" required />
                <label htmlFor="acceptTerms" className="text-xs text-muted-foreground leading-snug">
                  I'm 18+ and accept the{" "}
                  <Link to="/responsible-gaming" className="text-primary underline">
                    Terms & Responsible Gaming
                  </Link>{" "}
                  policy.
                </label>
              </div>

              <Button type="submit" disabled={submitting} className="btn-kasi w-full">
                <Zap size={16} className="fill-current mr-1" />
                {submitting ? "Creating account..." : "Create Account & Claim R150"}
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
                <Shield size={12} />
                Secured · WCGB compliant · 18+
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
