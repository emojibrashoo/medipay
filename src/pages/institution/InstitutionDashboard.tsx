import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockInvoices, mockInsurancePayments, mockTransactions, mockInstitutionUsers, mockProducts } from "@/data/mockData";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  FileText,
  Activity,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CreditCard,
  Shield,
  Package,
  UserCog,
  Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InstitutionDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Filter data for current institution
  const institutionInvoices = mockInvoices.filter(invoice => invoice.institutionId === user?.id);
  const institutionPayments = mockInsurancePayments.filter(payment => payment.institutionId === user?.id);
  const institutionTransactions = mockTransactions.filter(transaction =>
    institutionInvoices.some(invoice => invoice.id === transaction.invoiceId)
  );
  const institutionUsers = mockInstitutionUsers.filter(u => u.institutionId === user?.id);
  const institutionProducts = mockProducts.filter(p => p.institutionId === user?.id);

  // Get current user's role and permissions
  const currentUser = institutionUsers.find(u => u.email === user?.email);
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager' || isAdmin;
  const canViewTransactions = isManager || currentUser?.permissions.includes('view_transactions');
  const canViewProducts = isManager || currentUser?.permissions.includes('view_products');
  const canViewReports = isManager || currentUser?.permissions.includes('view_reports');

  // Calculate stats
  const totalRevenue = institutionInvoices
    .filter(invoice => invoice.status === 'paid' || invoice.status === 'confirmed')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const insurancePayments = institutionPayments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingRevenue = institutionInvoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const totalPatients = new Set(institutionInvoices.map(invoice => invoice.patientId)).size;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "All time earnings",
      color: "text-paid"
    },
    {
      title: "Insurance Payments",
      value: `$${insurancePayments.toLocaleString()}`,
      icon: Shield,
      description: "Received from insurance",
      color: "text-confirmed"
    },
    {
      title: "Active Users",
      value: institutionUsers.filter(u => u.status === 'active').length.toString(),
      icon: UserCog,
      description: "Institution staff",
      color: "text-primary"
    },
    {
      title: "Products/Services",
      value: institutionProducts.filter(p => p.isActive).length.toString(),
      icon: Package,
      description: "Active services",
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
              Manage your institution's financial operations and patient care
            </p>
          </div>
          <Building2 className="w-16 h-16 text-white/80" />
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
            Common tasks to manage your institution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {canViewTransactions && (
              <Button
                className="h-auto p-6 flex-col gap-3 bg-gradient-medical hover:scale-105 transition-smooth"
                onClick={() => navigate('/institution/transactions')}
              >
                <CreditCard className="w-8 h-8" />
                <div className="text-center">
                  <p className="font-semibold">View Transactions</p>
                  <p className="text-sm opacity-90">All patient payments</p>
                </div>
              </Button>
            )}

            {canViewTransactions && (
              <Button
                variant="outline"
                className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-smooth"
                onClick={() => navigate('/institution/insurance-payments')}
              >
                <Shield className="w-8 h-8" />
                <div className="text-center">
                  <p className="font-semibold">Insurance Payments</p>
                  <p className="text-sm text-muted-foreground">View insurance claims</p>
                </div>
              </Button>
            )}

            {canViewProducts && (
              <Button
                variant="outline"
                className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-smooth"
                onClick={() => navigate('/institution/products')}
              >
                <Package className="w-8 h-8" />
                <div className="text-center">
                  <p className="font-semibold">Manage Products</p>
                  <p className="text-sm text-muted-foreground">Services & pricing</p>
                </div>
              </Button>
            )}

            {isAdmin && (
              <Button
                variant="outline"
                className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-smooth"
                onClick={() => navigate('/institution/users')}
              >
                <UserCog className="w-8 h-8" />
                <div className="text-center">
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-sm text-muted-foreground">Staff & permissions</p>
                </div>
              </Button>
            )}

            {canViewReports && (
              <Button
                variant="outline"
                className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-smooth"
                onClick={() => navigate('/institution/reports')}
              >
                <TrendingUp className="w-8 h-8" />
                <div className="text-center">
                  <p className="font-semibold">Financial Reports</p>
                  <p className="text-sm text-muted-foreground">Analytics & insights</p>
                </div>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions - Only visible to users with transaction permissions */}
      {canViewTransactions && (
        <Card className="medical-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Latest patient payments and insurance claims
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/institution/transactions')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {institutionTransactions.length > 0 ? (
              <div className="space-y-4">
                {institutionTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{transaction.service}</h4>
                        <StatusBadge status={transaction.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Patient: {transaction.patientName} • Doctor: {transaction.doctorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${transaction.amount}</p>
                      <p className="text-sm text-muted-foreground">{transaction.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No transactions yet</p>
                <p className="text-muted-foreground">
                  Transactions will appear here as patients make payments
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Products Overview - Only visible to users with product permissions */}
      {canViewProducts && (
        <Card className="medical-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Products & Services
                </CardTitle>
                <CardDescription>
                  Your institution's service offerings
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/institution/products')}
              >
                Manage Products
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {institutionProducts.length > 0 ? (
              <div className="space-y-4">
                {institutionProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Category: {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${product.unitPrice.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.unit && `/ ${product.unit}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No products yet</p>
                <p className="text-muted-foreground mb-4">
                  Add your first service or product
                </p>
                <Button onClick={() => navigate('/institution/products')}>
                  Add Product
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Insurance Payments Overview - Only visible to users with transaction permissions */}
      {canViewTransactions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Insurance Payments
              </CardTitle>
              <CardDescription>
                Payments received from insurance companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-confirmed/10">
                  <span className="font-medium">Total Received</span>
                  <span className="font-bold text-confirmed">${insurancePayments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                  <span className="font-medium">Claims Processed</span>
                  <span className="font-bold text-primary">{institutionPayments.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-paid/10">
                  <span className="font-medium">Success Rate</span>
                  <span className="font-bold text-paid">
                    {institutionPayments.length > 0 ?
                      Math.round((institutionPayments.filter(p => p.status === 'paid').length / institutionPayments.length) * 100) : 0}%
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
                    <p className="text-xl font-bold">{Math.floor(institutionInvoices.length * 0.4)}</p>
                    <p className="text-xs text-muted-foreground">New Invoices</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{Math.floor(totalPatients * 0.6)}</p>
                    <p className="text-xs text-muted-foreground">Patients Served</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
