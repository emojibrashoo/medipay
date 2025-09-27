import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSuiWallet } from '@/contexts/SuiWalletContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  CheckCircle, 
  X, 
  Copy, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export default function SuiWalletButton() {
  const { 
    isConnected, 
    isConnecting, 
    address, 
    balance, 
    connect, 
    disconnect, 
    refreshBalance,
    formatAddress 
  } = useSuiWallet();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Your Sui wallet has been connected successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const handleRefreshBalance = async () => {
    try {
      setIsRefreshing(true);
      await refreshBalance();
      toast({
        title: "Balance Refreshed",
        description: "Your wallet balance has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh balance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewOnExplorer = () => {
    if (address) {
      const explorerUrl = `https://suiexplorer.com/address/${address}?network=testnet`;
      window.open(explorerUrl, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Button 
        onClick={handleConnect} 
        disabled={isConnecting}
        className="gap-2"
      >
        {isConnecting ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {isConnecting ? 'Connecting...' : 'Connect Sui Wallet'}
      </Button>
    );
  }

  return (
    <Card className="medical-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Sui Wallet Connected
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="gap-1"
          >
            <X className="w-3 h-3" />
            Disconnect
          </Button>
        </div>
        <CardDescription>
          Your wallet is connected to the Sui blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Address</label>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="text-sm font-mono flex-1">
              {formatAddress(address || '')}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewOnExplorer}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Balance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Balance</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshBalance}
              disabled={isRefreshing}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              SUI
            </Badge>
            <span className="text-lg font-semibold">
              {balance.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Network */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Network</label>
          <Badge variant="secondary" className="gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Sui Testnet
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

