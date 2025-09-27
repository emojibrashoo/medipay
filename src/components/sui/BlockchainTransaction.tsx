import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSuiWallet } from '@/contexts/SuiWalletContext';
import { useToast } from '@/hooks/use-toast';
import { HealthcareTransaction, healthcareUtils } from '@/lib/sui';
import { 
  Zap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';

interface TransactionStatus {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash?: string;
  error?: string;
}

interface BlockchainTransactionProps {
  title: string;
  description: string;
  onExecute: () => Promise<string>;
  disabled?: boolean;
  className?: string;
}

export default function BlockchainTransaction({
  title,
  description,
  onExecute,
  disabled = false,
  className = ''
}: BlockchainTransactionProps) {
  const { isConnected, formatAddress } = useSuiWallet();
  const { toast } = useToast();
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>({
    status: 'idle'
  });

  const handleExecute = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Sui wallet to execute transactions.",
        variant: "destructive",
      });
      return;
    }

    try {
      setTransactionStatus({ status: 'pending' });
      
      const hash = await onExecute();
      
      setTransactionStatus({ 
        status: 'success', 
        hash 
      });

      toast({
        title: "Transaction Successful",
        description: "Your transaction has been submitted to the blockchain.",
      });
    } catch (error: any) {
      setTransactionStatus({ 
        status: 'error', 
        error: error.message || 'Transaction failed'
      });

      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to execute transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyHash = () => {
    if (transactionStatus.hash) {
      navigator.clipboard.writeText(transactionStatus.hash);
      toast({
        title: "Hash Copied",
        description: "Transaction hash copied to clipboard.",
      });
    }
  };

  const handleViewOnExplorer = () => {
    if (transactionStatus.hash) {
      const explorerUrl = `https://suiexplorer.com/txblock/${transactionStatus.hash}?network=testnet`;
      window.open(explorerUrl, '_blank');
    }
  };

  const getStatusIcon = () => {
    switch (transactionStatus.status) {
      case 'pending':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getStatusBadge = () => {
    switch (transactionStatus.status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
      case 'success':
        return <Badge variant="default" className="gap-1 bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" />Success</Badge>;
      case 'error':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={`medical-card ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactionStatus.status === 'success' && transactionStatus.hash && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Transaction Hash</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyHash}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewOnExplorer}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <code className="text-xs text-green-700 break-all">
              {formatAddress(transactionStatus.hash)}
            </code>
          </div>
        )}

        {transactionStatus.status === 'error' && transactionStatus.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-800">Error</span>
            </div>
            <p className="text-xs text-red-700">{transactionStatus.error}</p>
          </div>
        )}

        <Button
          onClick={handleExecute}
          disabled={disabled || !isConnected || transactionStatus.status === 'pending'}
          className="w-full gap-2"
        >
          {transactionStatus.status === 'pending' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Execute on Blockchain
            </>
          )}
        </Button>

        {!isConnected && (
          <p className="text-xs text-muted-foreground text-center">
            Connect your Sui wallet to execute blockchain transactions
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Specific healthcare transaction components
export function CreateInvoiceTransaction({ 
  patientId, 
  doctorId, 
  institutionId, 
  service, 
  amount, 
  description 
}: {
  patientId: string;
  doctorId: string;
  institutionId: string;
  service: string;
  amount: number;
  description?: string;
}) {
  const { createInvoice } = useSuiWallet();

  const handleExecute = async () => {
    return await createInvoice({
      patientId,
      doctorId,
      institutionId,
      service,
      amount,
      description
    });
  };

  return (
    <BlockchainTransaction
      title="Create Invoice"
      description={`Create a blockchain invoice for ${service} ($${amount})`}
      onExecute={handleExecute}
    />
  );
}

export function PayInvoiceTransaction({ 
  invoiceId, 
  amount 
}: {
  invoiceId: string;
  amount: number;
}) {
  const { payInvoice } = useSuiWallet();

  const handleExecute = async () => {
    return await payInvoice({
      invoiceId,
      amount
    });
  };

  return (
    <BlockchainTransaction
      title="Pay Invoice"
      description={`Pay invoice ${invoiceId} ($${amount})`}
      onExecute={handleExecute}
    />
  );
}

export function CreateMedicalRecordTransaction({
  patientId,
  doctorId,
  institutionId,
  diagnosis,
  treatment,
  notes,
  visitDate
}: {
  patientId: string;
  doctorId: string;
  institutionId: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  visitDate: string;
}) {
  const { createMedicalRecord } = useSuiWallet();

  const handleExecute = async () => {
    return await createMedicalRecord({
      patientId,
      doctorId,
      institutionId,
      diagnosis,
      treatment,
      notes,
      visitDate
    });
  };

  return (
    <BlockchainTransaction
      title="Create Medical Record"
      description={`Create blockchain medical record for ${diagnosis}`}
      onExecute={handleExecute}
    />
  );
}

export function CreatePrescriptionTransaction({
  patientId,
  doctorId,
  medicationName,
  dosage,
  frequency,
  duration,
  quantity,
  instructions
}: {
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}) {
  const { createPrescription } = useSuiWallet();

  const handleExecute = async () => {
    return await createPrescription({
      patientId,
      doctorId,
      medicationName,
      dosage,
      frequency,
      duration,
      quantity,
      instructions
    });
  };

  return (
    <BlockchainTransaction
      title="Create Prescription"
      description={`Create blockchain prescription for ${medicationName}`}
      onExecute={handleExecute}
    />
  );
}
