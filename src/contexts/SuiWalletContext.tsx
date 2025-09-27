import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiError, healthcareUtils } from '@/lib/sui';

interface SuiWalletContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  balance: number;
  
  // Wallet functions
  connect: () => Promise<void>;
  disconnect: () => void;
  
  // Transaction functions
  executeTransaction: (txb: TransactionBlock) => Promise<string>;
  signAndExecuteTransaction: (txb: TransactionBlock) => Promise<string>;
  
  // Healthcare specific functions
  createInvoice: (params: any) => Promise<string>;
  payInvoice: (params: any) => Promise<string>;
  createMedicalRecord: (params: any) => Promise<string>;
  createPrescription: (params: any) => Promise<string>;
  
  // Utility functions
  refreshBalance: () => Promise<void>;
  formatAddress: (address: string) => string;
}

const SuiWalletContext = createContext<SuiWalletContextType | undefined>(undefined);

interface SuiWalletProviderProps {
  children: ReactNode;
}

export function SuiWalletProvider({ children }: SuiWalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState<any>(null);

  // Initialize wallet connection
  useEffect(() => {
    const initWallet = async () => {
      try {
        // Check if wallet is already connected
        if (typeof window !== 'undefined' && window.suiWallet) {
          const accounts = await window.suiWallet.getAccounts();
          if (accounts.length > 0) {
            setAddress(accounts[0].address);
            setIsConnected(true);
            await refreshBalance();
          }
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
      }
    };

    initWallet();
  }, []);

  // Connect to wallet
  const connect = async () => {
    try {
      setIsConnecting(true);
      
      if (typeof window === 'undefined' || !window.suiWallet) {
        throw new SuiError('Sui wallet not found. Please install a Sui wallet extension.');
      }

      const accounts = await window.suiWallet.requestAccounts();
      if (accounts.length === 0) {
        throw new SuiError('No accounts found. Please create an account in your wallet.');
      }

      setAddress(accounts[0].address);
      setIsConnected(true);
      setWallet(window.suiWallet);
      await refreshBalance();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setWallet(null);
    setBalance(0);
  };

  // Refresh balance
  const refreshBalance = async () => {
    if (!address) return;
    
    try {
      const client = new SuiClient({ url: getFullnodeUrl('testnet') });
      const balance = await client.getBalance({
        owner: address,
        coinType: '0x2::sui::SUI',
      });
      setBalance(healthcareUtils.mistToSui(parseInt(balance.totalBalance)));
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  // Execute transaction
  const executeTransaction = async (txb: TransactionBlock): Promise<string> => {
    if (!wallet) {
      throw new SuiError('Wallet not connected');
    }

    try {
      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      return result.digest;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new SuiError('Transaction failed', error.code);
    }
  };

  // Sign and execute transaction
  const signAndExecuteTransaction = async (txb: TransactionBlock): Promise<string> => {
    return executeTransaction(txb);
  };

  // Healthcare specific functions
  const createInvoice = async (params: any): Promise<string> => {
    const txb = new TransactionBlock();
    // Implementation would go here
    return executeTransaction(txb);
  };

  const payInvoice = async (params: any): Promise<string> => {
    const txb = new TransactionBlock();
    // Implementation would go here
    return executeTransaction(txb);
  };

  const createMedicalRecord = async (params: any): Promise<string> => {
    const txb = new TransactionBlock();
    // Implementation would go here
    return executeTransaction(txb);
  };

  const createPrescription = async (params: any): Promise<string> => {
    const txb = new TransactionBlock();
    // Implementation would go here
    return executeTransaction(txb);
  };

  const formatAddress = (addr: string) => healthcareUtils.formatAddress(addr);

  const value: SuiWalletContextType = {
    isConnected,
    isConnecting,
    address,
    balance,
    connect,
    disconnect,
    executeTransaction,
    signAndExecuteTransaction,
    createInvoice,
    payInvoice,
    createMedicalRecord,
    createPrescription,
    refreshBalance,
    formatAddress,
  };

  return (
    <SuiWalletContext.Provider value={value}>
      {children}
    </SuiWalletContext.Provider>
  );
}

export function useSuiWallet() {
  const context = useContext(SuiWalletContext);
  if (context === undefined) {
    throw new Error('useSuiWallet must be used within a SuiWalletProvider');
  }
  return context;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    suiWallet?: {
      requestAccounts: () => Promise<Array<{ address: string }>>;
      getAccounts: () => Promise<Array<{ address: string }>>;
      signAndExecuteTransactionBlock: (params: any) => Promise<any>;
      hasPermissions: () => Promise<boolean>;
      requestPermissions: () => Promise<boolean>;
    };
  }
}

