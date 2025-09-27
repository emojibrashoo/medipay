import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSuiWallet } from '@/contexts/SuiWalletContext';
import { useToast } from '@/hooks/use-toast';
import { HealthcareTransaction as HealthcareTx, healthcareUtils } from '@/lib/sui';
import { 
  FileText, 
  CreditCard, 
  Stethoscope, 
  Pill, 
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';

interface TransactionFormProps {
  type: 'invoice' | 'payment' | 'medical_record' | 'prescription';
  onSuccess?: (txHash: string) => void;
}

export default function HealthcareTransaction({ type, onSuccess }: TransactionFormProps) {
  const { isConnected, executeTransaction, address } = useSuiWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [invoiceForm, setInvoiceForm] = useState({
    patientId: '',
    doctorId: '',
    institutionId: '',
    service: '',
    amount: '',
    description: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: ''
  });

  const [medicalRecordForm, setMedicalRecordForm] = useState({
    patientId: '',
    doctorId: '',
    institutionId: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    visitDate: new Date().toISOString().split('T')[0]
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    doctorId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: '',
    instructions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Sui wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const txb = new HealthcareTx();
      let result: string;

      switch (type) {
        case 'invoice':
          result = await createInvoice(txb);
          break;
        case 'payment':
          result = await payInvoice(txb);
          break;
        case 'medical_record':
          result = await createMedicalRecord(txb);
          break;
        case 'prescription':
          result = await createPrescription(txb);
          break;
        default:
          throw new Error('Invalid transaction type');
      }

      setTxHash(result);
      toast({
        title: "Transaction Successful",
        description: "Your transaction has been submitted to the blockchain.",
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to submit transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createInvoice = async (txb: HealthcareTx): Promise<string> => {
    const amount = parseFloat(invoiceForm.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    txb.createInvoice({
      patientId: invoiceForm.patientId,
      doctorId: invoiceForm.doctorId,
      institutionId: invoiceForm.institutionId,
      service: invoiceForm.service,
      amount: amount,
      description: invoiceForm.description
    });

    return executeTransaction(txb.getTransactionBlock());
  };

  const payInvoice = async (txb: HealthcareTx): Promise<string> => {
    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    txb.payInvoice({
      invoiceId: paymentForm.invoiceId,
      amount: amount
    });

    return executeTransaction(txb.getTransactionBlock());
  };

  const createMedicalRecord = async (txb: HealthcareTx): Promise<string> => {
    txb.createMedicalRecord({
      patientId: medicalRecordForm.patientId,
      doctorId: medicalRecordForm.doctorId,
      institutionId: medicalRecordForm.institutionId,
      diagnosis: medicalRecordForm.diagnosis,
      treatment: medicalRecordForm.treatment,
      notes: medicalRecordForm.notes,
      visitDate: medicalRecordForm.visitDate
    });

    return executeTransaction(txb.getTransactionBlock());
  };

  const createPrescription = async (txb: HealthcareTx): Promise<string> => {
    const quantity = parseInt(prescriptionForm.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error('Invalid quantity');
    }

    txb.createPrescription({
      patientId: prescriptionForm.patientId,
      doctorId: prescriptionForm.doctorId,
      medicationName: prescriptionForm.medicationName,
      dosage: prescriptionForm.dosage,
      frequency: prescriptionForm.frequency,
      duration: prescriptionForm.duration,
      quantity: quantity,
      instructions: prescriptionForm.instructions
    });

    return executeTransaction(txb.getTransactionBlock());
  };

  const getTitle = () => {
    switch (type) {
      case 'invoice': return 'Create Invoice';
      case 'payment': return 'Pay Invoice';
      case 'medical_record': return 'Create Medical Record';
      case 'prescription': return 'Create Prescription';
      default: return 'Healthcare Transaction';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'invoice': return <FileText className="w-5 h-5" />;
      case 'payment': return <CreditCard className="w-5 h-5" />;
      case 'medical_record': return <Stethoscope className="w-5 h-5" />;
      case 'prescription': return <Pill className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'invoice': return 'Create a new invoice on the Sui blockchain';
      case 'payment': return 'Pay an invoice using Sui tokens';
      case 'medical_record': return 'Create a medical record on the blockchain';
      case 'prescription': return 'Create a prescription on the blockchain';
      default: return 'Submit a healthcare transaction';
    }
  };

  if (!isConnected) {
    return (
      <Card className="medical-card">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <XCircle className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Wallet Required</h3>
          <p className="text-muted-foreground">
            Please connect your Sui wallet to perform blockchain transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {getTitle()}
        </CardTitle>
        <CardDescription>
          {getDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {txHash ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Transaction Successful</p>
                <p className="text-sm text-green-600">Transaction hash: {healthcareUtils.formatAddress(txHash)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`https://suiexplorer.com/txblock/${txHash}?network=testnet`, '_blank')}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTxHash(null);
                  setError(null);
                }}
              >
                New Transaction
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'invoice' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={invoiceForm.patientId}
                      onChange={(e) => setInvoiceForm({...invoiceForm, patientId: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctorId">Doctor ID</Label>
                    <Input
                      id="doctorId"
                      value={invoiceForm.doctorId}
                      onChange={(e) => setInvoiceForm({...invoiceForm, doctorId: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="institutionId">Institution ID</Label>
                  <Input
                    id="institutionId"
                    value={invoiceForm.institutionId}
                    onChange={(e) => setInvoiceForm({...invoiceForm, institutionId: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="service">Service</Label>
                  <Input
                    id="service"
                    value={invoiceForm.service}
                    onChange={(e) => setInvoiceForm({...invoiceForm, service: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (SUI)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000000001"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={invoiceForm.description}
                    onChange={(e) => setInvoiceForm({...invoiceForm, description: e.target.value})}
                  />
                </div>
              </>
            )}

            {type === 'payment' && (
              <>
                <div>
                  <Label htmlFor="invoiceId">Invoice ID</Label>
                  <Input
                    id="invoiceId"
                    value={paymentForm.invoiceId}
                    onChange={(e) => setPaymentForm({...paymentForm, invoiceId: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (SUI)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000000001"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    required
                  />
                </div>
              </>
            )}

            {type === 'medical_record' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={medicalRecordForm.patientId}
                      onChange={(e) => setMedicalRecordForm({...medicalRecordForm, patientId: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctorId">Doctor ID</Label>
                    <Input
                      id="doctorId"
                      value={medicalRecordForm.doctorId}
                      onChange={(e) => setMedicalRecordForm({...medicalRecordForm, doctorId: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="institutionId">Institution ID</Label>
                  <Input
                    id="institutionId"
                    value={medicalRecordForm.institutionId}
                    onChange={(e) => setMedicalRecordForm({...medicalRecordForm, institutionId: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    value={medicalRecordForm.diagnosis}
                    onChange={(e) => setMedicalRecordForm({...medicalRecordForm, diagnosis: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="treatment">Treatment</Label>
                  <Textarea
                    id="treatment"
                    value={medicalRecordForm.treatment}
                    onChange={(e) => setMedicalRecordForm({...medicalRecordForm, treatment: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={medicalRecordForm.notes}
                    onChange={(e) => setMedicalRecordForm({...medicalRecordForm, notes: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="visitDate">Visit Date</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={medicalRecordForm.visitDate}
                    onChange={(e) => setMedicalRecordForm({...medicalRecordForm, visitDate: e.target.value})}
                    required
                  />
                </div>
              </>
            )}

            {type === 'prescription' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={prescriptionForm.patientId}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, patientId: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctorId">Doctor ID</Label>
                    <Input
                      id="doctorId"
                      value={prescriptionForm.doctorId}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, doctorId: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="medicationName">Medication Name</Label>
                  <Input
                    id="medicationName"
                    value={prescriptionForm.medicationName}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, medicationName: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={prescriptionForm.dosage}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      id="frequency"
                      value={prescriptionForm.frequency}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={prescriptionForm.duration}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={prescriptionForm.quantity}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, quantity: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={prescriptionForm.instructions}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
                  />
                </div>
              </>
            )}

            {error && (
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full gap-2">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                getIcon()
              )}
              {isLoading ? 'Processing...' : `Submit ${getTitle()}`}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
