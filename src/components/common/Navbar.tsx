'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { formatAddress } from '@/lib/utils';
import { Shield, Activity, Stethoscope, UserCheck, Search, CheckCircle2, Wallet, ExternalLink, Zap } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, isMonadNetwork, balance, isConnecting, connectWallet, switchToMonad, disconnectWallet } = useWallet();

  const navLinks = [
    { name: 'Overview', href: '/', icon: Activity },
    { name: 'Staff Terminal', href: '/doctor', icon: Stethoscope },
    { name: 'Patient Portal', href: '/patient', icon: UserCheck },
    { name: 'Audit Explorer', href: '/audit', icon: Search },
    { name: 'Record Verifier', href: '/verify', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">MedAccess</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  MONAD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Decentralized Medical Audit Log</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Web3 / Monad Network & Wallet Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Monad Live Indicator Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium font-mono text-[11px]">10k TPS • ~1s Finality</span>
            </div>

            {/* Wallet Button */}
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-medium transition-all shadow-md shadow-purple-900/30 active:scale-95 disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Monad'}</span>
              </button>
            ) : !isMonadNetwork ? (
              <button
                onClick={switchToMonad}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium hover:bg-amber-500/30 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Switch to Monad</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs font-medium text-white">{balance} MON</span>
                  <span className="text-[10px] text-purple-400 font-mono">Monad Testnet</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  title="Click to disconnect"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 text-xs text-purple-200 font-mono transition-all group"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>{formatAddress(address || '')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-900 overflow-x-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded text-[11px] font-medium ${
                  isActive ? 'text-purple-300 font-semibold' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
