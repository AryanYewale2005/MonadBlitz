'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { MONAD_TESTNET } from '@/lib/monad';
import { WalletState } from '@/types/web3';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    isMonadNetwork: false,
    balance: '0',
    isConnecting: false,
    error: null,
  });

  const checkNetwork = (chainId: number | null) => {
    return chainId === MONAD_TESTNET.chainId;
  };

  const updateWalletState = useCallback(async (provider: ethers.BrowserProvider, accounts: string[]) => {
    try {
      if (accounts.length === 0) {
        setWallet({
          address: null,
          isConnected: false,
          chainId: null,
          isMonadNetwork: false,
          balance: '0',
          isConnecting: false,
          error: null,
        });
        return;
      }

      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      const balanceBig = await provider.getBalance(accounts[0]);
      const balance = parseFloat(ethers.formatEther(balanceBig)).toFixed(4);

      setWallet({
        address: accounts[0],
        isConnected: true,
        chainId,
        isMonadNetwork: checkNetwork(chainId),
        balance,
        isConnecting: false,
        error: null,
      });
    } catch (err: any) {
      console.error('Failed to update wallet state:', err);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window === 'undefined') return;

    if (!(window as any).ethereum) {
      setWallet(prev => ({
        ...prev,
        error: 'MetaMask or Web3 wallet not detected. Running in Monad Sandbox mode.',
      }));
      return;
    }

    try {
      setWallet(prev => ({ ...prev, isConnecting: true, error: null }));
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      await updateWalletState(provider, accounts);
    } catch (err: any) {
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: err.message || 'Failed to connect wallet',
      }));
    }
  };

  const switchToMonad = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return;

    const hexChainId = '0x' + MONAD_TESTNET.chainId.toString(16);
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (switchError: any) {
      // If network is not added to user's wallet (code 4902), add it
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hexChainId,
                chainName: MONAD_TESTNET.chainName,
                nativeCurrency: MONAD_TESTNET.nativeCurrency,
                rpcUrls: MONAD_TESTNET.rpcUrls,
                blockExplorerUrls: MONAD_TESTNET.blockExplorerUrls,
              },
            ],
          });
        } catch (addError: any) {
          console.error('Failed to add Monad Testnet:', addError);
        }
      }
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
      isMonadNetwork: false,
      balance: '0',
      isConnecting: false,
      error: null,
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return;

    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const handleAccountsChanged = (accounts: string[]) => {
      updateWalletState(provider, accounts);
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
    (window as any).ethereum.on('chainChanged', handleChainChanged);

    // Initial check
    provider.listAccounts().then((accounts) => {
      if (accounts.length > 0) {
        updateWalletState(provider, accounts.map(a => a.address));
      }
    }).catch(() => {});

    return () => {
      if ((window as any).ethereum.removeListener) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [updateWalletState]);

  return {
    ...wallet,
    connectWallet,
    switchToMonad,
    disconnectWallet,
  };
}
