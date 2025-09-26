import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, Activity, CreditCard, Users, Lock, Zap } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Every transaction is secured and verified through blockchain technology"
    },
    {
      icon: Activity,
      title: "Real-time Tracking",
      description: "Monitor payment status and transaction history in real-time"
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Simple, secure payment processing with crypto wallet integration"
    },
    {
      icon: Users,
      title: "Patient-Doctor Network",
      description: "Seamless connection between healthcare providers and patients"
    },
    {
      icon: Lock,
      title: "HIPAA Compliant",
      description: "Full compliance with healthcare privacy and security regulations"
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description: "Proof-of-stake verification for immediate transaction confirmation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-primary/5">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-medical flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-confirmed bg-clip-text text-transparent">
                MediPay
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                Features
              </a>
              <a 
                href="#about" 
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                About
              </a>
              <Button
                variant="ghost"
                onClick={() => navigate('/transactions')}
              >
                View Transactions
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                size="sm"
                className="bg-gradient-medical hover:scale-105 transition-smooth"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Blockchain-Powered Healthcare Payments
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-confirmed to-primary bg-clip-text text-transparent">
              MediPay
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Transparent, secure, and instant medical transaction management. 
              Built on blockchain technology for the future of healthcare payments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="hero-gradient text-white font-semibold px-8 py-6 text-lg transition-smooth hover:scale-105 medical-shadow"
                onClick={() => navigate('/login?role=patient')}
              >
                <Users className="w-5 h-5 mr-2" />
                Login as Patient
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-6 text-lg transition-smooth hover:scale-105"
                onClick={() => navigate('/login?role=doctor')}
              >
                <Activity className="w-5 h-5 mr-2" />
                Login as Doctor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose MediPay?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revolutionary features that make medical payments transparent, secure, and efficient
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="medical-card transition-smooth hover:scale-105 hover:shadow-medical">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-medical flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* About/CTA Section */}
      <div id="about" className="container mx-auto px-4 py-20">
        <Card className="medical-card text-center p-8 md:p-12">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Healthcare Payments?
            </CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto">
              Join thousands of healthcare providers and patients already using MediPay 
              for secure, transparent medical transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                size="lg"
                className="hero-gradient text-white font-semibold px-8 py-6 text-lg transition-smooth hover:scale-105"
                onClick={() => navigate('/register')}
              >
                Get Started Today
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-6 text-lg transition-smooth"
                onClick={() => navigate('/transactions')}
              >
                View Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}