import { MonadNetworkConfig } from '@/types/web3';

export const MONAD_TESTNET: MonadNetworkConfig = {
  chainId: 10143,
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: [
    process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz',
    'https://rpc.testnet.monad.xyz',
  ],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
  targetBlockTimeSec: 1.0,
  tpsCapacity: 10000,
};

export const MONAD_DEVNET: MonadNetworkConfig = {
  chainId: 31337,
  chainName: 'Monad Local / Devnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: ['http://localhost:8545'],
  targetBlockTimeSec: 1.0,
  tpsCapacity: 10000,
};

// Fallback / active network
export const ACTIVE_NETWORK = MONAD_TESTNET;
