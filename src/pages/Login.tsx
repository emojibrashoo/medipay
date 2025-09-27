import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuthStore, UserRole } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Activity, Wallet, Home } from "lucide-react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const { toast } = useToast();

  // Set role from URL params if provided
  useState(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'doctor' || roleParam === 'patient') {
      setRole(roleParam);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, role);

      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        // Redirect to appropriate dashboard
        navigate(role === 'doctor' ? '/doctor' : '/patient');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Use demo@demo.com with password: demo123",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCryptoLogin = () => {
    toast({
      title: "Crypto Wallet Login",
      description: "Crypto wallet integration coming soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-primary/5 flex items-center justify-center p-4">
      {/* Home Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 gap-2"
        onClick={() => navigate('/')}
      >
        <Home className="w-4 h-4" />
        Home
      </Button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-medical mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to MediPay</h1>
          <p className="text-muted-foreground mt-2">
            Secure login to your healthcare payment dashboard
          </p>
        </div>

        <Card className="medical-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {role === 'doctor' ? (
                <><Activity className="w-5 h-5" /> Doctor Login</>
              ) : (
                <><Users className="w-5 h-5" /> Patient Login</>
              )}
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">Login as</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Patient
                      </div>
                    </SelectItem>
                    <SelectItem value="doctor">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Doctor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full hero-gradient text-white font-semibold transition-smooth hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-4 w-full">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-4 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <ConnectWalletButton />
            </div>

            <div className="mt-6 text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-hover font-medium transition-smooth"
                >
                  Sign up
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              <p className="font-medium mb-2">Demo Credentials:</p>
              <p>Patient: patient@demo.com</p>
              <p>Doctor: doctor@demo.com</p>
              <p>Password: demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}