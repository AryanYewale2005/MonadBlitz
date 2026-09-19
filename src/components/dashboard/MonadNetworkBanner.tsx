'use client';

import React from 'react';
import { Zap, Cpu, Clock, Layers, ShieldAlert } from 'lucide-react';
import { MONAD_TESTNET } from '@/lib/monad';

interface MonadNetworkBannerProps {
  currentBlockNumber: number;
}

export default function MonadNetworkBanner({ currentBlockNumber }: MonadNetworkBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-cyan-950/70 border border-purple-500/30 p-4 sm:p-6 shadow-xl shadow-purple-950/20 mb-8 backdrop-blur-md">
      {/* Background glow effects */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Chain & Purpose */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
              {MONAD_TESTNET.chainName}
            </span>
            <span className="text-xs text-slate-400 font-mono">Chain ID: {MONAD_TESTNET.chainId}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Immutable Healthcare Audit Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Off-chain medical records cryptographically anchored to the Monad EVM. Every read, update, or emergency override generates an untamperable on-chain proof with sub-second finality.
          </p>
        </div>

        {/* Right: Live Blockchain Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
          {/* Telemetry 1: Block Height */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Block Height</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base sm:text-lg font-bold font-mono text-white">
                #{currentBlockNumber.toLocaleString()}
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
            </div>
          </div>

          {/* Telemetry 2: Throughput */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Execution</span>
            </div>
            <span className="text-base sm:text-lg font-bold font-mono text-white mt-1">
              10,000 TPS
            </span>
          </div>

          {/* Telemetry 3: Finality */}
          <div className="col-span-2 sm:col-span-1 bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Finality</span>
            </div>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-300 mt-1">
              ~1.0 sec
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
