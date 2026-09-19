export interface MonadNetworkConfig {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  targetBlockTimeSec: number;
  tpsCapacity: number;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  isMonadNetwork: boolean;
  balance: string;
  isConnecting: boolean;
  error: string | null;
}
