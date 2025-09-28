import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { mockTransactions, mockInvoices } from "@/data/mockData";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  ExternalLink
} from "lucide-react";

export default function PatientTransactions() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Filter transactions for current user
  const userTransactions = mockTransactions.filter(transaction => 
    transaction.patientId === user?.id
  );
  
  // Filter by search term
  const filteredTransactions = userTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    const matchesDate = (() => {
      if (dateFilter === "all") return true;
      const transactionDate = new Date(transaction.timestamp);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          return transactionDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return transactionDate >= monthAgo;
        case "year":
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return transactionDate >= yearAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate stats
  const totalTransactions = userTransactions.length;
  const totalSpent = userTransactions
    .filter(t => t.status === 'confirmed' || t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = userTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);
  const successfulTransactions = userTransactions
    .filter(t => t.status === 'confirmed' || t.status === 'paid').length;

  const stats = [
    {
      title: "Total Transactions",
      value: totalTransactions.toString(),
      icon: CreditCard,
      description: "All time",
      color: "text-primary"
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      description: "Successfully paid",
      color: "text-paid"
    },
    {
      title: "Pending Amount",
      value: `$${pendingAmount.toLocaleString()}`,
      icon: Clock,
      description: "Awaiting confirmation",
      color: "text-pending"
    },
    {
      title: "Success Rate",
      value: `${totalTransactions > 0 ? Math.round((successfulTransactions / totalTransactions) * 100) : 0}%`,
      icon: CheckCircle,
      description: "Successful payments",
      color: "text-confirmed"
    }
  ];

  const handleDownloadReceipt = (transaction: any) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for transaction ${transaction.id} has been downloaded.`,
    });
    // In a real app, this would generate and download the PDF
  };

  const handleViewDetails = (transaction: any) => {
    toast({
      title: "Transaction Details",
      description: `Viewing details for transaction ${transaction.id}`,
    });
    // In a real app, this would open a detailed view modal
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-paid" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-pending" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">
            View and manage all your medical payment transactions
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => window.print()}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
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

      {/* Filters */}
      <Card className="medical-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Transactions
            <Badge variant="secondary" className="ml-2">
              {filteredTransactions.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Your medical payment transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(transaction.status)}
                      <h4 className="font-semibold">{transaction.service}</h4>
                      <StatusBadge status={transaction.status} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p>Doctor: {transaction.doctorName}</p>
                      <p>Date: {new Date(transaction.timestamp).toLocaleDateString()}</p>
                      <p>Transaction ID: {transaction.id}</p>
                      <p>Time: {new Date(transaction.timestamp).toLocaleTimeString()}</p>
                    </div>
                    {transaction.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        Note: {transaction.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-bold text-lg">${transaction.amount}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(transaction)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Details
                      </Button>
                      {(transaction.status === 'confirmed' || transaction.status === 'paid') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReceipt(transaction)}
                          className="flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all" 
                  ? "Try adjusting your search filters"
                  : "Your transaction history will appear here"
                }
              </p>
              {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      {filteredTransactions.length > 0 && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Summary
            </CardTitle>
            <CardDescription>
              Overview of filtered transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <p className="text-2xl font-bold text-primary">
                  {filteredTransactions.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-paid/10">
                <p className="text-2xl font-bold text-paid">
                  ${filteredTransactions
                    .filter(t => t.status === 'confirmed' || t.status === 'paid')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-confirmed/10">
                <p className="text-2xl font-bold text-confirmed">
                  {filteredTransactions.length > 0 ? 
                    Math.round((filteredTransactions.filter(t => t.status === 'confirmed' || t.status === 'paid').length / filteredTransactions.length) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

