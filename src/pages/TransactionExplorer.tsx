import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockTransactions } from "@/data/mockData";
import { Search, Filter, Download, Activity, Link, Shield, Home } from "lucide-react";

export default function TransactionExplorer() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter transactions by search term
  const filteredTransactions = mockTransactions.filter(transaction =>
    transaction.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatHash = (hash?: string) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

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
              <span className="text-sm text-muted-foreground hidden sm:block">
                Transaction Explorer
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                size="sm"
                className="bg-gradient-medical hover:scale-105 transition-smooth"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-medical mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Transaction Explorer</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete transparency of all medical transactions on the MediPay network. 
            View real-time payment status and blockchain verification.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="medical-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-medical flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-primary">{mockTransactions.length}</p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-paid/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-paid" />
              </div>
              <p className="text-2xl font-bold text-paid">
                {mockTransactions.filter(t => t.status === 'confirmed').length}
              </p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-pending/20 flex items-center justify-center mx-auto mb-3">
                <Link className="w-6 h-6 text-pending" />
              </div>
              <p className="text-2xl font-bold text-pending">
                {mockTransactions.filter(t => t.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">
                ${mockTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Volume</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="medical-card mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by patient, doctor, service, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Blockchain Transactions
            </CardTitle>
            <CardDescription>
              Real-time view of all medical payment transactions with blockchain verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-6 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{transaction.service}</h3>
                          <StatusBadge status={transaction.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Transaction ID</p>
                            <p className="font-mono">{transaction.id}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Timestamp</p>
                            <p>{new Date(transaction.timestamp).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Patient</p>
                            <p className="font-medium">{transaction.patientName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Healthcare Provider</p>
                            <p className="font-medium">{transaction.doctorName}</p>
                          </div>
                          {transaction.blockchainHash && (
                            <div>
                              <p className="text-muted-foreground">Blockchain Hash</p>
                              <p className="font-mono text-primary">
                                {formatHash(transaction.blockchainHash)}
                              </p>
                            </div>
                          )}
                          {transaction.proofOfStake && (
                            <div>
                              <p className="text-muted-foreground">Proof of Stake</p>
                              <p className="font-mono text-confirmed">
                                {transaction.proofOfStake}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-bold">${transaction.amount}</p>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        
                        {transaction.status === 'confirmed' && (
                          <div className="mt-2 flex items-center gap-1 text-confirmed text-sm">
                            <Shield className="w-4 h-4" />
                            Verified on Blockchain
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? 'No matching transactions' : 'No transactions available'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Transactions will appear here as they are processed'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blockchain Info */}
        <Card className="medical-card mt-8 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Why Blockchain Transparency?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-medical flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Immutable Records</h4>
                <p className="text-sm text-muted-foreground">
                  All transactions are permanently recorded and cannot be altered
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-medical flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Real-time Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Instant proof-of-stake verification for all payments
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-medical flex items-center justify-center mx-auto mb-3">
                  <Link className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Complete Transparency</h4>
                <p className="text-sm text-muted-foreground">
                  Full visibility into payment flows and transaction history
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}