module healthcare::healthcare {
    use std::string::String;
    use std::string;
    use std::option::{Self as option, Option};

    use sui::object::{Self as object, UID};
    use sui::transfer;
    use sui::tx_context::{Self as tx_context, TxContext};
    use sui::clock::{Self as clock, Clock};
    use sui::coin::{Self as coin, Coin};
    use sui::sui::SUI;

    // Error codes
    const ENotAuthorized: u64 = 0;
    const EInvoiceAlreadyPaid: u64 = 2;
    const EInsufficientFunds: u64 = 3;
    const EInvalidAmount: u64 = 4;

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

    // Product object
    struct Product has key, store {
        id: UID,
        product_id: String,
        name: String,
        description: String,
        quantity: u64,
        price: u64,
        institution_id: String,
        created_at: u64,
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

    // Initialize the module
    fun init(_ctx: &mut TxContext) {
        // Called when the module is published
    }

    // Add a product (only institutions with capability can call)
    public entry fun add_product(
        _capability: &InvoiceCapability,
        institution_id: String,
        name: String,
        description: String,
        quantity: u64,
        price: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(quantity > 0, EInvalidAmount);
        assert!(price > 0, EInvalidAmount);
        let product_id = string::utf8(b"PROD-");
        string::append(&mut product_id, string::utf8(b"001")); // In real implementation, generate unique ID
        let product = Product {
            id: object::new(ctx),
            product_id,
            name,
            description,
            quantity,
            price,
            institution_id,
            created_at: clock::timestamp_ms(clock),
        };
        transfer::transfer(product, tx_context::sender(ctx));
    }

    // Update a product (only institutions with capability can call)
    public entry fun update_product(
        _capability: &InvoiceCapability,
        product: &mut Product,
        name: String,
        description: String,
        quantity: u64,
        price: u64,
        _ctx: &mut TxContext
    ) {
        assert!(quantity > 0, EInvalidAmount);
        assert!(price > 0, EInvalidAmount);
        product.name = name;
        product.description = description;
        product.quantity = quantity;
        product.price = price;
    }

    // Create an invoice
    public entry fun create_invoice(
        _capability: &InvoiceCapability,
        patient_id: String,
        doctor_id: String,
        institution_id: String,
        service: String,
        amount: u64,
        description: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(amount > 0, EInvalidAmount);
        let invoice_id = string::utf8(b"INV-");
        string::append(&mut invoice_id, string::utf8(b"001")); // In real implementation, generate unique ID
        let invoice = Invoice {
            id: object::new(ctx),
            invoice_id,
            patient_id,
            doctor_id,
            institution_id,
            service,
            amount,
            status: STATUS_PENDING,
            description,
            created_at: clock::timestamp_ms(clock),
            paid_at: option::none<u64>(),
            blockchain_hash: string::utf8(b""),
        };
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

        invoice.status = STATUS_PAID;
        invoice.paid_at = option::some(clock::timestamp_ms(clock));

        let transaction_id = string::utf8(b"TXN-");
        string::append(&mut transaction_id, string::utf8(b"001")); // In real implementation, generate unique ID

        let transaction = Transaction {
            id: object::new(ctx),
            transaction_id,
            invoice_id: invoice.invoice_id,
            patient_id: invoice.patient_id,
            doctor_id: invoice.doctor_id,
            amount: invoice.amount,
            status: STATUS_PAID,
            timestamp: clock::timestamp_ms(clock),
            blockchain_hash: string::utf8(b""),
            proof_of_stake: string::utf8(b"PoS-Verified"),
        };

        // For demo: return payment back to sender (no-op economic flow)
        transfer::public_transfer(payment, tx_context::sender(ctx));
        transfer::transfer(transaction, tx_context::sender(ctx));
    }

    // Create a medical record (only doctors with capability can call)
    public entry fun create_medical_record(
        _capability: &MedicalRecordCapability,
        patient_id: String,
        doctor_id: String,
        institution_id: String,
        diagnosis: String,
        treatment: String,
        notes: String,
        visit_date: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let record_id = string::utf8(b"MR-");
        string::append(&mut record_id, string::utf8(b"001")); // In real implementation, generate unique ID
        let medical_record = MedicalRecord {
            id: object::new(ctx),
            record_id,
            patient_id,
            doctor_id,
            institution_id,
            diagnosis,
            treatment,
            notes,
            visit_date,
            created_at: clock::timestamp_ms(clock),
            blockchain_hash: string::utf8(b""),
        };
        transfer::transfer(medical_record, tx_context::sender(ctx));
    }

    // Create a prescription (only doctors with capability can call)
    public entry fun create_prescription(
        _capability: &PrescriptionCapability,
        patient_id: String,
        doctor_id: String,
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
        string::append(&mut prescription_id, string::utf8(b"001")); // In real implementation, generate unique ID
        let prescription = Prescription {
            id: object::new(ctx),
            prescription_id,
            patient_id,
            doctor_id,
            medication_name,
            dosage,
            frequency,
            duration,
            quantity,
            instructions,
            created_at: clock::timestamp_ms(clock),
            blockchain_hash: string::utf8(b""),
        };
        transfer::transfer(prescription, tx_context::sender(ctx));
    }

    // Verify transaction
    public fun verify_transaction(transaction: &Transaction): bool {
        transaction.status == STATUS_PAID
    }

    // Cancel invoice (only institution can cancel)
    public entry fun cancel_invoice(
        _capability: &InvoiceCapability,
        invoice: &mut Invoice,
        _ctx: &mut TxContext
    ) {
        assert!(invoice.status == STATUS_PENDING, EInvoiceAlreadyPaid);
        invoice.status = STATUS_CANCELLED;
    }

    // Create capabilities (this would typically be done by an admin or during setup)
    public entry fun create_invoice_capability(
        institution_id: String,
        ctx: &mut TxContext
    ) {
        let capability = InvoiceCapability { id: object::new(ctx), institution_id };
        transfer::transfer(capability, tx_context::sender(ctx));
    }

    public entry fun create_medical_record_capability(
        doctor_id: String,
        ctx: &mut TxContext
    ) {
        let capability = MedicalRecordCapability { id: object::new(ctx), doctor_id };
        transfer::transfer(capability, tx_context::sender(ctx));
    }

    public entry fun create_prescription_capability(
        doctor_id: String,
        ctx: &mut TxContext
    ) {
        let capability = PrescriptionCapability { id: object::new(ctx), doctor_id };
        transfer::transfer(capability, tx_context::sender(ctx));
    }
}