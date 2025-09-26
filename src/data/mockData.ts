export type TransactionStatus = 'pending' | 'paid' | 'confirmed';

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  service: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  paidAt?: string;
  description?: string;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  patientName: string;
  doctorName: string;
  service: string;
  amount: number;
  status: TransactionStatus;
  timestamp: string;
  blockchainHash?: string;
  proofOfStake?: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '2',
    doctorName: 'Dr. Sarah Johnson',
    service: 'General Consultation',
    amount: 150,
    status: 'confirmed',
    createdAt: '2024-01-15T10:00:00Z',
    paidAt: '2024-01-15T14:30:00Z',
    description: 'Annual health checkup and consultation',
  },
  {
    id: 'INV-002',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '2',
    doctorName: 'Dr. Sarah Johnson',
    service: 'Blood Test Analysis',
    amount: 85,
    status: 'paid',
    createdAt: '2024-01-20T09:15:00Z',
    paidAt: '2024-01-20T16:45:00Z',
    description: 'Comprehensive blood panel and lipid profile',
  },
  {
    id: 'INV-003',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '3',
    doctorName: 'Dr. Michael Chen',
    service: 'Cardiology Consultation',
    amount: 250,
    status: 'pending',
    createdAt: '2024-01-25T14:00:00Z',
    description: 'Heart health assessment and ECG',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    invoiceId: 'INV-001',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    service: 'General Consultation',
    amount: 150,
    status: 'confirmed',
    timestamp: '2024-01-15T14:30:00Z',
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
    proofOfStake: 'PoS-Verified-001',
  },
  {
    id: 'TXN-002',
    invoiceId: 'INV-002',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    service: 'Blood Test Analysis',
    amount: 85,
    status: 'paid',
    timestamp: '2024-01-20T16:45:00Z',
    blockchainHash: '0x9876543210fedcba0987654321fedcba',
    proofOfStake: 'PoS-Verified-002',
  },
  {
    id: 'TXN-003',
    invoiceId: 'INV-003',
    patientName: 'John Smith',
    doctorName: 'Dr. Michael Chen',
    service: 'Cardiology Consultation',
    amount: 250,
    status: 'pending',
    timestamp: '2024-01-25T14:00:00Z',
  },
];

export const mockDoctors = [
  { id: '2', name: 'Dr. Sarah Johnson', specialty: 'General Medicine' },
  { id: '3', name: 'Dr. Michael Chen', specialty: 'Cardiology' },
  { id: '4', name: 'Dr. Emily Rodriguez', specialty: 'Dermatology' },
];

export const mockPatients = [
  { id: '1', name: 'John Smith', email: 'john@example.com' },
  { id: '5', name: 'Alice Cooper', email: 'alice@example.com' },
  { id: '6', name: 'Bob Wilson', email: 'bob@example.com' },
];