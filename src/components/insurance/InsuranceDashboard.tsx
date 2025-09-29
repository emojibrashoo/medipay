import React, { useEffect, useState } from 'react';
import { SuiClient } from '@mysten/sui.js';
import { getMedicalRecord, getPrescription, getTransaction } from '../sui/BlockchainTransaction';

export function InsuranceDashboard() {
  const [records, setRecords] = useState([]);
  const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });

  useEffect(() => {
    async function fetchData() {
      // Replace with actual IDs
      const record = await getMedicalRecord(client, 'RECORD_ID');
      const prescription = await getPrescription(client, 'PRESCRIPTION_ID');
      const transaction = await getTransaction(client, 'TRANSACTION_ID');
      setRecords([record, prescription, transaction]);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Insurance: View Medical Records, Prescriptions, Transactions</h2>
      <pre>{JSON.stringify(records, null, 2)}</pre>
    </div>
  );
}
