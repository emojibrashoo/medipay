import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

// Sui network configuration
export const SUI_NETWORKS = {
  testnet: 'https://fullnode.testnet.sui.io:443',
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
  localnet: 'http://127.0.0.1:9000',
} as const;

export type SuiNetwork = keyof typeof SUI_NETWORKS;

// Default to testnet for development
export const DEFAULT_NETWORK: SuiNetwork = 'testnet';

// Create Sui client
export const suiClient = new SuiClient({
  url: SUI_NETWORKS[DEFAULT_NETWORK],
});

// Healthcare smart contract configuration
export const HEALTHCARE_CONTRACT = {
  // This would be the actual package ID after deployment
  PACKAGE_ID: '0x0', // Replace with actual package ID after deployment
  MODULE_NAME: 'healthcare',
  
  // Object types
  INVOICE_OBJECT_TYPE: '0x0::healthcare::Invoice',
  TRANSACTION_OBJECT_TYPE: '0x0::healthcare::Transaction',
  MEDICAL_RECORD_OBJECT_TYPE: '0x0::healthcare::MedicalRecord',
  PRESCRIPTION_OBJECT_TYPE: '0x0::healthcare::Prescription',
  
  // Function names
  FUNCTIONS: {
    CREATE_INVOICE: 'create_invoice',
    PAY_INVOICE: 'pay_invoice',
    CREATE_MEDICAL_RECORD: 'create_medical_record',
    CREATE_PRESCRIPTION: 'create_prescription',
    VERIFY_TRANSACTION: 'verify_transaction',
    GET_INVOICE: 'get_invoice',
    GET_MEDICAL_RECORD: 'get_medical_record',
  }
} as const;

// Healthcare transaction helpers
export class HealthcareTransaction {
  private txb: TransactionBlock;

  constructor() {
    this.txb = new TransactionBlock();
  }

  // Create a new invoice on the blockchain
  createInvoice(params: {
    patientId: string;
    doctorId: string;
    institutionId: string;
    service: string;
    amount: number;
    description?: string;
  }) {
    const { patientId, doctorId, institutionId, service, amount, description } = params;
    
    this.txb.moveCall({
      target: `${HEALTHCARE_CONTRACT.PACKAGE_ID}::${HEALTHCARE_CONTRACT.MODULE_NAME}::${HEALTHCARE_CONTRACT.FUNCTIONS.CREATE_INVOICE}`,
      arguments: [
        this.txb.pure.string(patientId),
        this.txb.pure.string(doctorId),
        this.txb.pure.string(institutionId),
        this.txb.pure.string(service),
        this.txb.pure.u64(amount * 1000000000), // Convert to MIST (1 SUI = 1,000,000,000 MIST)
        this.txb.pure.string(description || ''),
      ],
    });

    return this;
  }

  // Pay an invoice
  payInvoice(params: {
    invoiceId: string;
    amount: number;
  }) {
    const { invoiceId, amount } = params;
    
    // Split coins for payment
    const [coin] = this.txb.splitCoins(this.txb.gas, [this.txb.pure.u64(amount * 1000000000)]);
    
    this.txb.moveCall({
      target: `${HEALTHCARE_CONTRACT.PACKAGE_ID}::${HEALTHCARE_CONTRACT.MODULE_NAME}::${HEALTHCARE_CONTRACT.FUNCTIONS.PAY_INVOICE}`,
      arguments: [
        this.txb.pure.string(invoiceId),
        coin,
      ],
    });

    return this;
  }

  // Create a medical record
  createMedicalRecord(params: {
    patientId: string;
    doctorId: string;
    institutionId: string;
    diagnosis: string;
    treatment: string;
    notes: string;
    visitDate: string;
  }) {
    const { patientId, doctorId, institutionId, diagnosis, treatment, notes, visitDate } = params;
    
    this.txb.moveCall({
      target: `${HEALTHCARE_CONTRACT.PACKAGE_ID}::${HEALTHCARE_CONTRACT.MODULE_NAME}::${HEALTHCARE_CONTRACT.FUNCTIONS.CREATE_MEDICAL_RECORD}`,
      arguments: [
        this.txb.pure.string(patientId),
        this.txb.pure.string(doctorId),
        this.txb.pure.string(institutionId),
        this.txb.pure.string(diagnosis),
        this.txb.pure.string(treatment),
        this.txb.pure.string(notes),
        this.txb.pure.string(visitDate),
      ],
    });

    return this;
  }

  // Create a prescription
  createPrescription(params: {
    patientId: string;
    doctorId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions: string;
  }) {
    const { patientId, doctorId, medicationName, dosage, frequency, duration, quantity, instructions } = params;
    
    this.txb.moveCall({
      target: `${HEALTHCARE_CONTRACT.PACKAGE_ID}::${HEALTHCARE_CONTRACT.MODULE_NAME}::${HEALTHCARE_CONTRACT.FUNCTIONS.CREATE_PRESCRIPTION}`,
      arguments: [
        this.txb.pure.string(patientId),
        this.txb.pure.string(doctorId),
        this.txb.pure.string(medicationName),
        this.txb.pure.string(dosage),
        this.txb.pure.string(frequency),
        this.txb.pure.string(duration),
        this.txb.pure.u64(quantity),
        this.txb.pure.string(instructions),
      ],
    });

    return this;
  }

  // Get the transaction block
  getTransactionBlock() {
    return this.txb;
  }

  // Set gas budget
  setGasBudget(budget: number) {
    this.txb.setGasBudget(budget);
    return this;
  }
}

// Utility functions for interacting with the blockchain
export const healthcareUtils = {
  // Convert SUI to MIST
  suiToMist: (sui: number) => Math.floor(sui * 1000000000),
  
  // Convert MIST to SUI
  mistToSui: (mist: number) => mist / 1000000000,
  
  // Format address for display
  formatAddress: (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },
  
  // Validate Sui address
  isValidAddress: (address: string) => {
    return /^0x[a-fA-F0-9]{64}$/.test(address);
  },
};

// Error handling for Sui transactions
export class SuiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SuiError';
  }
}

// Transaction result types
export interface TransactionResult {
  digest: string;
  effects?: any;
  events?: any[];
  objectChanges?: any[];
}

export interface InvoiceData {
  id: string;
  patientId: string;
  doctorId: string;
  institutionId: string;
  service: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  description?: string;
  blockchainHash?: string;
}

export interface MedicalRecordData {
  id: string;
  patientId: string;
  doctorId: string;
  institutionId: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  visitDate: string;
  createdAt: string;
  blockchainHash?: string;
}

export interface PrescriptionData {
  id: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  createdAt: string;
  blockchainHash?: string;
}

