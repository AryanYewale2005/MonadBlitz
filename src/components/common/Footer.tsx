import React from 'react';
import { ShieldCheck, Lock, Cpu, ExternalLink } from 'lucide-react';
import { DEFAULT_CONTRACT_ADDRESS } from '@/contracts/addresses';
import { formatAddress } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-auto text-slate-400 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Column 1: Privacy Guarantees */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">HIPAA & GDPR Compliant Architecture</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Zero patient personal identifiable information (PII) is stored on-chain. Only cryptographic record hashes and clinical access intents are immutably logged.
              </p>
            </div>
          </div>

          {/* Column 2: Monad Blockchain Engine */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-950/50 border border-purple-500/20 text-purple-400 mt-0.5">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Powered by Monad EVM</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Utilizing Monad’s parallelized EVM execution engine for 10,000 TPS, 1-second single-slot finality, and negligible transaction fees for high-frequency hospital workflows.
              </p>
            </div>
          </div>

          {/* Column 3: Contract Verification */}
          <div className="flex flex-col md:items-end gap-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs">Contract: {formatAddress(DEFAULT_CONTRACT_ADDRESS, 5)}</span>
            </div>
            <a
              href={`https://testnet.monadexplorer.com/address/${DEFAULT_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px] transition-colors"
            >
              <span>View on Monad Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[11px] text-slate-400 mt-1">
              © {new Date().getFullYear()} Monad Medical Data Access Logger. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
