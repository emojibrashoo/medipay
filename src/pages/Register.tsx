import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore, UserRole } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Activity, UserPlus, Home, Building2 } from "lucide-react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(email, password, name, role);

      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to MediPay. Your account has been created successfully.",
        });

        // Redirect to appropriate dashboard
        navigate(role === 'doctor' ? '/doctor' : '/patient');
      } else {
        toast({
          title: "Registration failed",
          description: "Something went wrong. Please try again.",
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
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Join MediPay</h1>
          <p className="text-muted-foreground mt-2">
            Create your account to start managing medical transactions
          </p>
        </div>

        <Card className="medical-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Create Account
            </CardTitle>
            <CardDescription>
              Choose your role and set up your secure account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
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
                    <SelectItem value="institution">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Healthcare Institution
                      </div>
                    </SelectItem>
                    <SelectItem value="insurance">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Insurance Company
                      </div>
                    </SelectItem>
                    <SelectItem value="doctor">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Healthcare Provider
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full hero-gradient text-white font-semibold transition-smooth hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 flex flex-col items-center">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-background via-accent/30 to-primary/5 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <ConnectWalletButton />
            </div>

            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-hover font-medium transition-smooth"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}