# Sui Blockchain Integration

This healthcare application integrates with the Sui blockchain to provide secure, transparent, and immutable healthcare transactions.

## Features

### 🔗 Blockchain Integration
- **Sui Wallet Connection**: Connect with Sui-compatible wallets
- **Smart Contract Transactions**: All healthcare operations are recorded on-chain
- **Immutable Records**: Medical records, prescriptions, and invoices are permanently stored
- **Transparent Payments**: All financial transactions are publicly verifiable

### 🏥 Healthcare Smart Contract
- **Invoice Management**: Create and pay invoices on the blockchain
- **Medical Records**: Store patient medical records immutably
- **Prescriptions**: Create and track prescriptions on-chain
- **Role-Based Access**: Different permissions for patients, doctors, institutions, and insurance

## Smart Contract Architecture

### Core Objects
- **Invoice**: Healthcare service billing with payment tracking
- **Transaction**: Payment records with blockchain verification
- **MedicalRecord**: Patient medical history and diagnoses
- **Prescription**: Medication prescriptions with dosage information

### Capabilities
- **InvoiceCapability**: Allows institutions to create invoices
- **MedicalRecordCapability**: Allows doctors to create medical records
- **PrescriptionCapability**: Allows doctors to create prescriptions

## Getting Started

### Prerequisites
1. **Sui CLI**: Install the Sui command-line interface
2. **Sui Wallet**: Install a Sui-compatible wallet (Sui Wallet, Suiet, etc.)
3. **Node.js**: Version 18 or higher

### Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Install Sui CLI**:
   ```bash
   curl -fLJO https://github.com/MystenLabs/sui/releases/download/mainnet-v1.18.0/sui-mainnet-v1.18.0-ubuntu-x86_64.tgz
   tar -xzf sui-mainnet-v1.18.0-ubuntu-x86_64.tgz
   sudo mv sui /usr/local/bin/
   ```

3. **Initialize Sui**:
   ```bash
   sui client new-address ed25519
   sui client faucet
   ```

### Deployment

1. **Deploy to Testnet**:
   ```bash
   ./scripts/deploy-contract.sh testnet
   ```

2. **Deploy to Mainnet** (Production):
   ```bash
   ./scripts/deploy-contract.sh mainnet
   ```

3. **Update Configuration**:
   After deployment, update the `PACKAGE_ID` in `src/lib/sui.ts` with the deployed contract address.

### Development

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Connect Wallet**:
   - Click "Connect Sui Wallet" on the login page
   - Approve the connection in your wallet
   - Your wallet address and balance will be displayed

3. **Test Transactions**:
   - Create medical records and prescriptions
   - Pay invoices using SUI tokens
   - View transaction history on Sui Explorer

## Smart Contract Functions

### Invoice Management
```move
// Create an invoice
public entry fun create_invoice(
    capability: &InvoiceCapability,
    patient_id: String,
    doctor_id: String,
    service: String,
    amount: u64,
    description: String,
    clock: &Clock,
    ctx: &mut TxContext
)

// Pay an invoice
public entry fun pay_invoice(
    invoice: &mut Invoice,
    payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

### Medical Records
```move
// Create a medical record
public entry fun create_medical_record(
    capability: &MedicalRecordCapability,
    patient_id: String,
    institution_id: String,
    diagnosis: String,
    treatment: String,
    notes: String,
    visit_date: u64,
    clock: &Clock,
    ctx: &mut TxContext
)
```

### Prescriptions
```move
// Create a prescription
public entry fun create_prescription(
    capability: &PrescriptionCapability,
    patient_id: String,
    medication_name: String,
    dosage: String,
    frequency: String,
    duration: String,
    quantity: u64,
    instructions: String,
    clock: &Clock,
    ctx: &mut TxContext
)
```

## Frontend Integration

### Wallet Connection
```typescript
import { useSuiWallet } from '@/contexts/SuiWalletContext';

const { isConnected, address, connect, disconnect } = useSuiWallet();
```

### Transaction Execution
```typescript
import { HealthcareTransaction } from '@/lib/sui';

const txb = new HealthcareTransaction()
  .createInvoice({
    patientId: 'patient-123',
    doctorId: 'doctor-456',
    institutionId: 'institution-789',
    service: 'Consultation',
    amount: 150,
    description: 'General consultation'
  })
  .getTransactionBlock();

const hash = await executeTransaction(txb);
```

### Blockchain Components
```typescript
import { CreateInvoiceTransaction, PayInvoiceTransaction } from '@/components/sui/BlockchainTransaction';

// Create invoice on blockchain
<CreateInvoiceTransaction
  patientId="patient-123"
  doctorId="doctor-456"
  institutionId="institution-789"
  service="Consultation"
  amount={150}
  description="General consultation"
/>

// Pay invoice on blockchain
<PayInvoiceTransaction
  invoiceId="INV-001"
  amount={150}
/>
```

## Security Features

### Access Control
- **Role-Based Permissions**: Different access levels for different user types
- **Capability System**: Only authorized users can perform specific actions
- **Signature Verification**: All transactions require wallet signatures

### Data Integrity
- **Immutable Records**: Once created, records cannot be modified
- **Blockchain Verification**: All data is cryptographically verified
- **Transparent Audit Trail**: Complete transaction history is publicly available

### Privacy Protection
- **HIPAA Compliance**: Sensitive data is handled according to healthcare regulations
- **Selective Disclosure**: Users control what information is shared
- **Encrypted Storage**: Sensitive data is encrypted before storage

## Network Configuration

### Testnet (Development)
- **RPC URL**: `https://fullnode.testnet.sui.io:443`
- **Explorer**: `https://suiexplorer.com/?network=testnet`
- **Faucet**: Available for free SUI tokens

### Mainnet (Production)
- **RPC URL**: `https://fullnode.mainnet.sui.io:443`
- **Explorer**: `https://suiexplorer.com/?network=mainnet`
- **Real SUI**: Requires real SUI tokens

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**:
   - Ensure you have a Sui-compatible wallet installed
   - Check that the wallet is unlocked
   - Try refreshing the page

2. **Transaction Failed**:
   - Check your SUI balance
   - Ensure you have enough gas
   - Verify the transaction parameters

3. **Contract Not Found**:
   - Ensure the contract is deployed
   - Check the PACKAGE_ID in configuration
   - Verify you're on the correct network

### Support

- **Sui Documentation**: https://docs.sui.io/
- **Sui Discord**: https://discord.gg/sui
- **GitHub Issues**: Create an issue in this repository

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Roadmap

- [ ] Multi-signature support for sensitive operations
- [ ] Integration with more wallet providers
- [ ] Advanced privacy features
- [ ] Mobile wallet support
- [ ] Cross-chain compatibility
- [ ] Automated testing suite
- [ ] Performance optimizations
