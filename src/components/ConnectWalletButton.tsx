import { ConnectButton } from '@mysten/dapp-kit';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useEffect } from 'react';
import { Wallet } from "lucide-react";

const ConnectWalletButton = () => {
    const account = useCurrentAccount();

    useEffect(() => {
        if (account) {
            console.log('Wallet connected:', account);
        }
    }, [account]);

    return (
        <ConnectButton
            connectText={
                <div className="flex items-center gap-2 rounded-md text-sm font-medium w-full justify-center">
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                </div>
            }
            className='w-full justify-center mt-6 bg-white text-black font-semibold hover:bg-white/90 transition-smooth'

        />
    );
};

export { ConnectWalletButton };
