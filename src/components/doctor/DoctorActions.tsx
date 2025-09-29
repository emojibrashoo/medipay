import React, { useState } from 'react';
import { useWallet } from '@mysten/wallet-adapter-react';
import { createMedicalRecord, createPrescription } from '../sui/HealthcareTransaction';

export function DoctorActions() {
  const wallet = useWallet();
  const [form, setForm] = useState({ patientId: '', diagnosis: '', treatment: '', notes: '', visitDate: '', medicationName: '', dosage: '', frequency: '', duration: '', quantity: '', instructions: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedicalRecord = async () => {
    // Replace with actual capability and clock IDs
    await createMedicalRecord(wallet, {
      capabilityId: 'YOUR_MEDICAL_RECORD_CAPABILITY_ID',
      patientId: form.patientId,
      institutionId: 'INSTITUTION_ID',
      diagnosis: form.diagnosis,
      treatment: form.treatment,
      notes: form.notes,
      visitDate: form.visitDate,
      clockId: 'CLOCK_ID',
    });
    alert('Medical record added!');
  };

  const handlePrescription = async () => {
    await createPrescription(wallet, {
      capabilityId: 'YOUR_PRESCRIPTION_CAPABILITY_ID',
      patientId: form.patientId,
      medicationName: form.medicationName,
      dosage: form.dosage,
      frequency: form.frequency,
      duration: form.duration,
      quantity: form.quantity,
      instructions: form.instructions,
      clockId: 'CLOCK_ID',
    });
    alert('Prescription added!');
  };

  return (
    <div>
      <h2>Add Medical Record</h2>
      <input name="patientId" placeholder="Patient ID" onChange={handleChange} />
      <input name="diagnosis" placeholder="Diagnosis" onChange={handleChange} />
      <input name="treatment" placeholder="Treatment" onChange={handleChange} />
      <input name="notes" placeholder="Notes" onChange={handleChange} />
      <input name="visitDate" placeholder="Visit Date" onChange={handleChange} />
      <button onClick={handleMedicalRecord}>Add Medical Record</button>

      <h2>Add Prescription</h2>
      <input name="medicationName" placeholder="Medication Name" onChange={handleChange} />
      <input name="dosage" placeholder="Dosage" onChange={handleChange} />
      <input name="frequency" placeholder="Frequency" onChange={handleChange} />
      <input name="duration" placeholder="Duration" onChange={handleChange} />
      <input name="quantity" placeholder="Quantity" onChange={handleChange} />
      <input name="instructions" placeholder="Instructions" onChange={handleChange} />
      <button onClick={handlePrescription}>Add Prescription</button>
    </div>
  );
}
