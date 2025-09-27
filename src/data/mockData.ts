export type TransactionStatus = 'pending' | 'paid' | 'confirmed';

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  institutionId?: string;
  institutionName?: string;
  service: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  paidAt?: string;
  description?: string;
  insuranceClaimId?: string;
  insuranceCoverage?: number;
  patientResponsibility?: number;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  institutionId?: string;
  institutionName?: string;
  visitDate: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  prescriptions: Prescription[];
  totalCost: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  createdAt: string;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  instructions: string;
}

export interface InsurancePayment {
  id: string;
  claimId: string;
  patientId: string;
  patientName: string;
  institutionId: string;
  institutionName: string;
  service: string;
  amount: number;
  status: TransactionStatus;
  processedDate: string;
  paymentDate?: string;
  description?: string;
}

export interface InstitutionUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  institutionId: string;
  status: 'active' | 'pending' | 'inactive';
  invitedBy: string;
  invitedAt: string;
  lastLogin?: string;
  permissions: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  unit: string;
  institutionId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
    doctorId: '4',
    doctorName: 'Dr. Sarah Johnson',
    institutionId: '2',
    institutionName: 'City General Hospital',
    service: 'General Consultation',
    amount: 150,
    status: 'confirmed',
    createdAt: '2024-01-15T10:00:00Z',
    paidAt: '2024-01-15T14:30:00Z',
    description: 'Annual health checkup and consultation',
    insuranceClaimId: 'CLM-001',
    insuranceCoverage: 120,
    patientResponsibility: 30,
  },
  {
    id: 'INV-002',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '4',
    doctorName: 'Dr. Sarah Johnson',
    institutionId: '2',
    institutionName: 'City General Hospital',
    service: 'Blood Test Analysis',
    amount: 85,
    status: 'paid',
    createdAt: '2024-01-20T09:15:00Z',
    paidAt: '2024-01-20T16:45:00Z',
    description: 'Comprehensive blood panel and lipid profile',
    insuranceClaimId: 'CLM-002',
    insuranceCoverage: 68,
    patientResponsibility: 17,
  },
  {
    id: 'INV-003',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '5',
    doctorName: 'Dr. Michael Chen',
    institutionId: '6',
    institutionName: 'Metro Medical Center',
    service: 'Cardiology Consultation',
    amount: 250,
    status: 'pending',
    createdAt: '2024-01-25T14:00:00Z',
    description: 'Heart health assessment and ECG',
    insuranceClaimId: 'CLM-003',
    insuranceCoverage: 200,
    patientResponsibility: 50,
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

export const mockInstitutions = [
  { id: '2', name: 'City General Hospital', type: 'Hospital' },
  { id: '6', name: 'Metro Medical Center', type: 'Clinic' },
];

export const mockInsuranceCompanies = [
  { id: '3', name: 'HealthCare Plus Insurance', type: 'Health Insurance' },
  { id: '7', name: 'MediCare Solutions', type: 'Health Insurance' },
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'MR-001',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '4',
    doctorName: 'Dr. Sarah Johnson',
    institutionId: '2',
    institutionName: 'City General Hospital',
    visitDate: '2024-01-15T10:00:00Z',
    diagnosis: 'Hypertension',
    treatment: 'Blood pressure monitoring and lifestyle counseling',
    notes: 'Patient presents with elevated blood pressure. Recommended dietary changes and regular exercise. Follow-up in 3 months.',
    prescriptions: [
      {
        id: 'RX-001',
        medicationName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        unitPrice: 2.50,
        totalPrice: 75.00,
        instructions: 'Take with food in the morning'
      }
    ],
    totalCost: 250.00,
    insuranceCoverage: 200.00,
    patientResponsibility: 50.00,
    createdAt: '2024-01-15T10:00:00Z'
  }
];

export const mockInsurancePayments: InsurancePayment[] = [
  {
    id: 'IP-001',
    claimId: 'CLM-001',
    patientId: '1',
    patientName: 'John Smith',
    institutionId: '2',
    institutionName: 'City General Hospital',
    service: 'General Consultation',
    amount: 200.00,
    status: 'paid',
    processedDate: '2024-01-16T09:00:00Z',
    paymentDate: '2024-01-16T14:30:00Z',
    description: 'Insurance payment for consultation services'
  }
];

export const mockInstitutionUsers: InstitutionUser[] = [
  {
    id: 'IU-001',
    email: 'admin@citygeneral.com',
    name: 'Dr. Sarah Johnson',
    role: 'admin',
    institutionId: '2',
    status: 'active',
    invitedBy: 'system',
    invitedAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-25T10:30:00Z',
    permissions: ['all']
  },
  {
    id: 'IU-002',
    email: 'manager@citygeneral.com',
    name: 'John Manager',
    role: 'manager',
    institutionId: '2',
    status: 'active',
    invitedBy: 'IU-001',
    invitedAt: '2024-01-05T09:00:00Z',
    lastLogin: '2024-01-24T14:20:00Z',
    permissions: ['view_transactions', 'view_products', 'view_reports']
  },
  {
    id: 'IU-003',
    email: 'staff@citygeneral.com',
    name: 'Jane Staff',
    role: 'staff',
    institutionId: '2',
    status: 'active',
    invitedBy: 'IU-001',
    invitedAt: '2024-01-10T11:00:00Z',
    lastLogin: '2024-01-23T16:45:00Z',
    permissions: ['view_transactions', 'view_products']
  },
  {
    id: 'IU-004',
    email: 'pending@citygeneral.com',
    name: 'Pending User',
    role: 'manager',
    institutionId: '2',
    status: 'pending',
    invitedBy: 'IU-001',
    invitedAt: '2024-01-20T15:00:00Z',
    permissions: ['view_transactions', 'view_products', 'view_reports']
  }
];

export const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'General Consultation',
    description: 'Standard medical consultation with a healthcare provider',
    category: 'Consultation',
    unitPrice: 150.00,
    unit: 'per visit',
    institutionId: '2',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PROD-002',
    name: 'Blood Test Panel',
    description: 'Comprehensive blood work including CBC, lipid profile, and metabolic panel',
    category: 'Laboratory',
    unitPrice: 85.00,
    unit: 'per test',
    institutionId: '2',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PROD-003',
    name: 'X-Ray Imaging',
    description: 'Standard X-ray imaging for diagnostic purposes',
    category: 'Imaging',
    unitPrice: 120.00,
    unit: 'per image',
    institutionId: '2',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PROD-004',
    name: 'Emergency Room Visit',
    description: 'Emergency department consultation and treatment',
    category: 'Emergency',
    unitPrice: 500.00,
    unit: 'per visit',
    institutionId: '2',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'PROD-005',
    name: 'Physical Therapy Session',
    description: 'One-on-one physical therapy session',
    category: 'Therapy',
    unitPrice: 100.00,
    unit: 'per session',
    institutionId: '2',
    isActive: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];