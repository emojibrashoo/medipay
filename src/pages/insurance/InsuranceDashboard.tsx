import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockInvoices, mockInsurancePayments, mockTransactions } from "@/data/mockData";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  FileText, 
  Activity, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Clock,
  CreditCard,
  Building2
} from "lucide-react";

export default function InsuranceDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Filter data for current insurance company
  const insurancePayments = mockInsurancePayments.filter(payment => payment.id.includes('IP'));
  const relatedInvoices = mockInvoices.filter(invoice => invoice.insuranceClaimId);
  const relatedTransactions = mockTransactions.filter(transaction => 
    relatedInvoices.some(invoice => invoice.id === transaction.invoiceId)
  );

  // Calculate stats
  const totalPayments = insurancePayments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const pendingPayments = insurancePayments
    .filter(payment => payment.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalClaims = insurancePayments.length;
  const totalPatients = new Set(insurancePayments.map(payment => payment.patientId)).size;
  const totalInstitutions = new Set(insurancePayments.map(payment => payment.institutionId)).size;

  const stats = [
    {
      title: "Total Payments",
      value: `$${totalPayments.toLocaleString()}`,
      icon: DollarSign,
      description: "All time payments",
      color: "text-paid"
    },
    {
      title: "Pending Claims",
      value: `$${pendingPayments.toLocaleString()}`,
      icon: Clock,
      description: "Awaiting processing",
      color: "text-pending"
    },
    {
      title: "Total Claims",
      value: totalClaims.toString(),
      icon: FileText,
      description: "Claims processed",
      color: "text-primary"
    },
    {
      title: "Covered Patients",
      value: totalPatients.toString(),
      icon: Users,
      description: "Active members",
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
              Manage insurance claims and monitor healthcare transactions
            </p>
          </div>
          <Shield className="w-16 h-16 text-white/80" />
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
            <Activity className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks to manage insurance operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-auto p-6 flex-col gap-3 bg-gradient-medical hover:scale-105 transition-smooth"
              onClick={() => navigate('/insurance/claims')}
            >
              <FileText className="w-8 h-8" />
              <div className="text-center">
                <p className="font-semibold">View Claims</p>
                <p className="text-sm opacity-90">All insurance claims</p>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-smooth"
              onClick={() => navigate('/insurance/transactions')}
            >
              <CreditCard className="w-8 h-8" />
              <div className="text-center">
                <p className="font-semibold">Patient Transactions</p>
                <p className="text-sm text-muted-foreground">View all transactions</p>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-smooth"
              onClick={() => navigate('/insurance/reports')}
            >
              <TrendingUp className="w-8 h-8" />
              <div className="text-center">
                <p className="font-semibold">Analytics</p>
                <p className="text-sm text-muted-foreground">Reports & insights</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Claims */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Claims
              </CardTitle>
              <CardDescription>
                Latest insurance claims and payments
              </CardDescription>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/insurance/claims')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insurancePayments.length > 0 ? (
            <div className="space-y-4">
              {insurancePayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{payment.service}</h4>
                      <StatusBadge status={payment.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Patient: {payment.patientName} • Institution: {payment.institutionName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Claim ID: {payment.claimId} • {new Date(payment.processedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${payment.amount}</p>
                    <p className="text-sm text-muted-foreground">{payment.id}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No claims yet</p>
              <p className="text-muted-foreground">
                Insurance claims will appear here as they are processed
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Overview
            </CardTitle>
            <CardDescription>
              Summary of payments and claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-paid/10">
                <span className="font-medium">Total Paid</span>
                <span className="font-bold text-paid">${totalPayments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-pending/10">
                <span className="font-medium">Pending Payments</span>
                <span className="font-bold text-pending">${pendingPayments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                <span className="font-medium">Claims Processed</span>
                <span className="font-bold text-primary">{totalClaims}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Network Coverage
            </CardTitle>
            <CardDescription>
              Healthcare providers and patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalInstitutions}</p>
                <p className="text-sm text-muted-foreground">Partner Institutions</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">{totalPatients}</p>
                  <p className="text-xs text-muted-foreground">Covered Patients</p>
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {totalClaims > 0 ? Math.round((insurancePayments.filter(p => p.status === 'paid').length / totalClaims) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Approval Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
