import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockInvoices } from "@/data/mockData";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Search, 
  Download, 
  CreditCard, 
  Calendar,
  Filter
} from "lucide-react";
import { Invoice } from "@/data/mockData";
import { PayInvoiceTransaction } from "@/components/sui/BlockchainTransaction";

export default function PatientInvoices() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter invoices for current user
  const userInvoices = mockInvoices.filter(invoice => invoice.patientId === user?.id);
  
  // Filter by search term
  const filteredInvoices = userInvoices.filter(invoice =>
    invoice.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayInvoice = (invoice: Invoice) => {
    toast({
      title: "Payment Initiated",
      description: `Payment for ${invoice.service} ($${invoice.amount}) is being processed.`,
    });
    // In a real app, this would integrate with payment processing
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast({
      title: "Download Started",
      description: `Invoice ${invoice.id} is being downloaded.`,
    });
    // In a real app, this would generate and download the PDF
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Invoices</h1>
          <p className="text-muted-foreground">
            View and manage all your medical invoices
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="medical-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search invoices by service, doctor, or invoice ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="medical-card transition-smooth hover:shadow-medical">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{invoice.service}</h3>
                      <StatusBadge status={invoice.status} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Invoice ID: {invoice.id}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        Doctor: {invoice.doctorName}
                      </div>
                      {invoice.paidAt && (
                        <div>
                          Paid: {new Date(invoice.paidAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {invoice.description && (
                      <p className="text-sm text-muted-foreground mt-3">
                        {invoice.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold">${invoice.amount}</p>
                      <p className="text-sm text-muted-foreground">Amount Due</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      
                      {invoice.status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-gradient-medical hover:scale-105 transition-smooth"
                          onClick={() => handlePayInvoice(invoice)}
                        >
                          <CreditCard className="w-4 h-4 mr-1" />
                          Pay Now
                        </Button>
                      )}
                    </div>

                    {/* Blockchain Payment Component */}
                    {invoice.status === 'pending' && (
                      <div className="mt-4 w-full">
                        <PayInvoiceTransaction
                          invoiceId={invoice.id}
                          amount={invoice.amount}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="medical-card">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'No matching invoices' : 'No invoices found'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Your medical invoices will appear here when created by healthcare providers'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Card */}
      {filteredInvoices.length > 0 && (
        <Card className="medical-card bg-gradient-card">
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
            <CardDescription>
              Overview of your medical expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-pending">
                  ${filteredInvoices
                    .filter(i => i.status === 'pending')
                    .reduce((sum, i) => sum + i.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-paid">
                  ${filteredInvoices
                    .filter(i => i.status === 'paid' || i.status === 'confirmed')
                    .reduce((sum, i) => sum + i.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Paid Amount</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  ${filteredInvoices
                    .reduce((sum, i) => sum + i.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Healthcare</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}