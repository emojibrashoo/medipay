import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Menu, 
  LogOut, 
  User, 
  Activity, 
  CreditCard, 
  FileText, 
  Settings,
  BarChart3,
  PlusCircle,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const patientNavItems: NavItem[] = [
    { title: "Dashboard", href: "/patient", icon: Activity },
    { title: "Invoices", href: "/patient/invoices", icon: FileText },
    { title: "Transactions", href: "/patient/transactions", icon: CreditCard },
    { title: "Profile", href: "/patient/profile", icon: User },
    { title: "Settings", href: "/patient/settings", icon: Settings },
  ];

  const doctorNavItems: NavItem[] = [
    { title: "Dashboard", href: "/doctor", icon: Activity },
    { title: "Create Invoice", href: "/doctor/create", icon: PlusCircle },
    { title: "Invoices", href: "/doctor/invoices", icon: FileText },
    { title: "Reports", href: "/doctor/reports", icon: BarChart3 },
    { title: "Profile", href: "/doctor/profile", icon: User },
    { title: "Settings", href: "/doctor/settings", icon: Settings },
  ];

  const navItems = user?.role === 'doctor' ? doctorNavItems : patientNavItems;

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-medical flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">MediPay</h2>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role} Dashboard
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 transition-smooth",
                    isActive && "bg-primary text-primary-foreground shadow-sm"
                  )}
                  onClick={() => {
                    navigate(item.href);
                    if (mobile) setSidebarOpen(false);
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarFallback className="bg-gradient-medical text-white">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-border medical-shadow">
          <NavContent />
        </div>
      </div>

      {/* Mobile Navigation */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <NavContent mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center gap-4">
              <div className="flex-1">
                <h1 className="text-xl font-semibold">
                  Welcome back, {user?.name}
                </h1>
              </div>
              
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hidden sm:flex"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="sm:hidden"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex flex-col gap-1 h-auto py-2 px-1",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => navigate(item.href)}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs truncate">{item.title}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}