import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockInvoices, mockPatients } from "@/data/mockData";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  FileText, 
  Activity, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Clock
} from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Filter invoices for current doctor
  const doctorInvoices = mockInvoices.filter(invoice => invoice.doctorId === user?.id);
  const recentInvoices = doctorInvoices.slice(0, 3);

  // Calculate stats
  const totalRevenue = doctorInvoices
    .filter(invoice => invoice.status === 'paid' || invoice.status === 'confirmed')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingRevenue = doctorInvoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPatients = new Set(doctorInvoices.map(invoice => invoice.patientId)).size;

  const stats = [
    {
      title: "Total Invoices",
      value: doctorInvoices.length.toString(),
      icon: FileText,
      description: "All time",
      color: "text-primary"
    },
    {
      title: "Revenue Earned",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Paid invoices",
      color: "text-paid"
    },
    {
      title: "Pending Revenue",
      value: `$${pendingRevenue.toLocaleString()}`,
      icon: Clock,
      description: "Awaiting payment",
      color: "text-pending"
    },
    {
      title: "Active Patients",
      value: totalPatients.toString(),
      icon: Users,
      description: "Unique patients",
      color: "text-confirmed"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="medical-card p-6 bg-gradient-hero text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-white/90">
              Manage your practice and track patient payments
            </p>
          </div>
          <Activity className="w-16 h-16 text-white/80" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="medical-card transition-smooth hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-medical flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks to manage your practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-auto p-6 flex-col gap-3 bg-gradient-medical hover:scale-105 transition-smooth"
              onClick={() => navigate('/doctor/create')}
            >
              <PlusCircle className="w-8 h-8" />
              <div className="text-center">
                <p className="font-semibold">Create Invoice</p>
                <p className="text-sm opacity-90">Bill a patient</p>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-smooth"
              onClick={() => navigate('/doctor/invoices')}
            >
              <FileText className="w-8 h-8" />
              <div className="text-center">
                <p className="font-semibold">View Invoices</p>
                <p className="text-sm text-muted-foreground">Manage all bills</p>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-smooth"
              onClick={() => navigate('/doctor/reports')}
            >
              <TrendingUp className="w-8 h-8" />
              <div className="text-center">
                <p className="font-semibold">View Reports</p>
                <p className="text-sm text-muted-foreground">Analytics & insights</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Invoices
              </CardTitle>
              <CardDescription>
                Latest bills you've created
              </CardDescription>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/doctor/invoices')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentInvoices.length > 0 ? (
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{invoice.service}</h4>
                      <StatusBadge status={invoice.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Patient: {invoice.patientName} • {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                    {invoice.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {invoice.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${invoice.amount}</p>
                    <p className="text-sm text-muted-foreground">{invoice.id}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No invoices yet</p>
              <p className="text-muted-foreground mb-4">
                Start by creating your first invoice
              </p>
              <Button onClick={() => navigate('/doctor/create')}>
                Create Invoice
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue Overview
            </CardTitle>
            <CardDescription>
              Your earnings breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-paid/10">
                <span className="font-medium">Paid Invoices</span>
                <span className="font-bold text-paid">${totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-pending/10">
                <span className="font-medium">Pending Payments</span>
                <span className="font-bold text-pending">${pendingRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                <span className="font-medium">Total Billed</span>
                <span className="font-bold text-primary">
                  ${(totalRevenue + pendingRevenue).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              This Month
            </CardTitle>
            <CardDescription>
              Current month performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  ${Math.floor(totalRevenue * 0.3).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Revenue This Month</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">{Math.floor(doctorInvoices.length * 0.4)}</p>
                  <p className="text-xs text-muted-foreground">New Invoices</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{Math.floor(totalPatients * 0.6)}</p>
                  <p className="text-xs text-muted-foreground">Patients Seen</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}