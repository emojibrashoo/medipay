module healthcare::healthcare {
    use std::string::String;
    use std::vector;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    // Error codes
    const ENotAuthorized: u64 = 0;
    const EInvoiceNotFound: u64 = 1;
    const EInvoiceAlreadyPaid: u64 = 2;
    const EInsufficientFunds: u64 = 3;
    const EInvalidAmount: u64 = 4;
    const EMedicalRecordNotFound: u64 = 5;
    const EPrescriptionNotFound: u64 = 6;

    // Invoice status
    const STATUS_PENDING: u8 = 0;
    const STATUS_PAID: u8 = 1;
    const STATUS_CANCELLED: u8 = 2;

    // Invoice object
    struct Invoice has key, store {
        id: UID,
        invoice_id: String,
        patient_id: String,
        doctor_id: String,
        institution_id: String,
        service: String,
        amount: u64,
        status: u8,
        description: String,
        created_at: u64,
        paid_at: Option<u64>,
        blockchain_hash: String,
    }

    // Transaction object
    struct Transaction has key, store {
        id: UID,
        transaction_id: String,
        invoice_id: String,
        patient_id: String,
        doctor_id: String,
        amount: u64,
        status: u8,
        timestamp: u64,
        blockchain_hash: String,
        proof_of_stake: String,
    }

    // Medical Record object
    struct MedicalRecord has key, store {
        id: UID,
        record_id: String,
        patient_id: String,
        doctor_id: String,
        institution_id: String,
        diagnosis: String,
        treatment: String,
        notes: String,
        visit_date: u64,
        created_at: u64,
        blockchain_hash: String,
    }

    // Prescription object
    struct Prescription has key, store {
        id: UID,
        prescription_id: String,
        patient_id: String,
        doctor_id: String,
        medication_name: String,
        dosage: String,
        frequency: String,
        duration: String,
        quantity: u64,
        instructions: String,
        created_at: u64,
        blockchain_hash: String,
    }

    // Capability for creating invoices (only institutions can create)
    struct InvoiceCapability has key {
        id: UID,
        institution_id: String,
    }

    // Capability for creating medical records (only doctors can create)
    struct MedicalRecordCapability has key {
        id: UID,
        doctor_id: String,
    }

    // Capability for creating prescriptions (only doctors can create)
    struct PrescriptionCapability has key {
        id: UID,
        doctor_id: String,
    }

    // Events
    struct InvoiceCreated has copy, drop {
        invoice_id: String,
        patient_id: String,
        amount: u64,
    }

    struct InvoicePaid has copy, drop {
        invoice_id: String,
        transaction_id: String,
        amount: u64,
    }

    struct MedicalRecordCreated has copy, drop {
        record_id: String,
        patient_id: String,
        doctor_id: String,
    }

    struct PrescriptionCreated has copy, drop {
        prescription_id: String,
        patient_id: String,
        doctor_id: String,
    }

    // Initialize the module
    fun init(ctx: &mut TxContext) {
        // This function is called when the module is published
        // In a real implementation, you might want to create some initial capabilities
    }

    // Create an invoice (only institutions with capability can call)
    public entry fun create_invoice(
        capability: &InvoiceCapability,
        patient_id: String,
        doctor_id: String,
        service: String,
        amount: u64,
        description: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(amount > 0, EInvalidAmount);
        
        let invoice_id = string::utf8(b"INV-");
        let invoice_id = string::append(&mut invoice_id, string::utf8(b"001")); // In real implementation, generate unique ID
        
        let invoice = Invoice {
            id: object::new(ctx),
            invoice_id: invoice_id,
            patient_id,
            doctor_id,
            institution_id: capability.institution_id,
            service,
            amount,
            status: STATUS_PENDING,
            description,
            created_at: clock::timestamp_ms(clock),
            paid_at: option::none(),
            blockchain_hash: string::utf8(b""), // Will be set when transaction is confirmed
        };

        // Emit event
        event::emit(InvoiceCreated {
            invoice_id: invoice.invoice_id,
            patient_id: invoice.patient_id,
            amount: invoice.amount,
        });

        // Transfer invoice to patient
        transfer::transfer(invoice, tx_context::sender(ctx));
    }

    // Pay an invoice
    public entry fun pay_invoice(
        invoice: &mut Invoice,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(invoice.status == STATUS_PENDING, EInvoiceAlreadyPaid);
        assert!(coin::value(&payment) >= invoice.amount, EInsufficientFunds);

        // Update invoice status
        invoice.status = STATUS_PAID;
        invoice.paid_at = option::some(clock::timestamp_ms(clock));

        // Create transaction record
        let transaction_id = string::utf8(b"TXN-");
        let transaction_id = string::append(&mut transaction_id, string::utf8(b"001")); // In real implementation, generate unique ID

        let transaction = Transaction {
            id: object::new(ctx),
            transaction_id,
            invoice_id: invoice.invoice_id,
            patient_id: invoice.patient_id,
            doctor_id: invoice.doctor_id,
            amount: invoice.amount,
            status: STATUS_PAID,
            timestamp: clock::timestamp_ms(clock),
            blockchain_hash: string::utf8(b""), // Will be set when transaction is confirmed
            proof_of_stake: string::utf8(b"PoS-Verified"), // In real implementation, generate actual PoS proof
        };

        // Emit event
        event::emit(InvoicePaid {
            invoice_id: invoice.invoice_id,
            transaction_id: transaction.transaction_id,
            amount: invoice.amount,
        });

        // Transfer payment to doctor/institution
        // In a real implementation, you would transfer the payment to the appropriate recipient
        let _ = coin::join(&mut balance::into_coin(balance::zero<SUI>()), payment);

        // Transfer transaction record to patient
        transfer::transfer(transaction, tx_context::sender(ctx));
    }

    // Create a medical record (only doctors with capability can call)
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
    ) {
        let record_id = string::utf8(b"MR-");
        let record_id = string::append(&mut record_id, string::utf8(b"001")); // In real implementation, generate unique ID

        let medical_record = MedicalRecord {
            id: object::new(ctx),
            record_id,
            patient_id,
            doctor_id: capability.doctor_id,
            institution_id,
            diagnosis,
            treatment,
            notes,
            visit_date,
            created_at: clock::timestamp_ms(clock),
            blockchain_hash: string::utf8(b""), // Will be set when transaction is confirmed
        };

        // Emit event
        event::emit(MedicalRecordCreated {
            record_id: medical_record.record_id,
            patient_id: medical_record.patient_id,
            doctor_id: medical_record.doctor_id,
        });

        // Transfer medical record to patient
        transfer::transfer(medical_record, tx_context::sender(ctx));
    }

    // Create a prescription (only doctors with capability can call)
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
    ) {
        assert!(quantity > 0, EInvalidAmount);

        let prescription_id = string::utf8(b"RX-");
        let prescription_id = string::append(&mut prescription_id, string::utf8(b"001")); // In real implementation, generate unique ID

        let prescription = Prescription {
            id: object::new(ctx),
            prescription_id,
            patient_id,
            doctor_id: capability.doctor_id,
            medication_name,
            dosage,
            frequency,
            duration,
            quantity,
            instructions,
            created_at: clock::timestamp_ms(clock),
            blockchain_hash: string::utf8(b""), // Will be set when transaction is confirmed
        };

        // Emit event
        event::emit(PrescriptionCreated {
            prescription_id: prescription.prescription_id,
            patient_id: prescription.patient_id,
            doctor_id: prescription.doctor_id,
        });

        // Transfer prescription to patient
        transfer::transfer(prescription, tx_context::sender(ctx));
    }

    // Get invoice details
    public fun get_invoice(invoice: &Invoice): (String, String, String, String, u64, u8) {
        (
            invoice.invoice_id,
            invoice.patient_id,
            invoice.doctor_id,
            invoice.service,
            invoice.amount,
            invoice.status
        )
    }

    // Get medical record details
    public fun get_medical_record(record: &MedicalRecord): (String, String, String, String, String) {
        (
            record.record_id,
            record.patient_id,
            record.doctor_id,
            record.diagnosis,
            record.treatment
        )
    }

    // Get prescription details
    public fun get_prescription(prescription: &Prescription): (String, String, String, String, String, u64) {
        (
            prescription.prescription_id,
            prescription.patient_id,
            prescription.medication_name,
            prescription.dosage,
            prescription.frequency,
            prescription.quantity
        )
    }

    // Verify transaction
    public fun verify_transaction(transaction: &Transaction): bool {
        transaction.status == STATUS_PAID
    }

    // Cancel invoice (only institution can cancel)
    public entry fun cancel_invoice(
        capability: &InvoiceCapability,
        invoice: &mut Invoice,
        ctx: &mut TxContext
    ) {
        assert!(invoice.institution_id == capability.institution_id, ENotAuthorized);
        assert!(invoice.status == STATUS_PENDING, EInvoiceAlreadyPaid);
        
        invoice.status = STATUS_CANCELLED;
    }

    // Create capabilities (this would typically be done by an admin or during setup)
    public entry fun create_invoice_capability(
        institution_id: String,
        ctx: &mut TxContext
    ) {
        let capability = InvoiceCapability {
            id: object::new(ctx),
            institution_id,
        };
        transfer::transfer(capability, tx_context::sender(ctx));
    }

    public entry fun create_medical_record_capability(
        doctor_id: String,
        ctx: &mut TxContext
    ) {
        let capability = MedicalRecordCapability {
            id: object::new(ctx),
            doctor_id,
        };
        transfer::transfer(capability, tx_context::sender(ctx));
    }

    public entry fun create_prescription_capability(
        doctor_id: String,
        ctx: &mut TxContext
    ) {
        let capability = PrescriptionCapability {
            id: object::new(ctx),
            doctor_id,
        };
        transfer::transfer(capability, tx_context::sender(ctx));
    }
}

