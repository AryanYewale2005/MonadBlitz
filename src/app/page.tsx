'use client';

import React from 'react';
import Link from 'next/link';
import { useAccessLogger } from '@/hooks/useAccessLogger';
import MonadNetworkBanner from '@/components/dashboard/MonadNetworkBanner';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';
import { Stethoscope, UserCheck, Search, CheckCircle2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { logs, patients, currentBlockNumber } = useAccessLogger();

  return (
    <div className="space-y-8">
      {/* Monad Live Blockchain Telemetry Banner */}
      <MonadNetworkBanner currentBlockNumber={currentBlockNumber} />

      {/* KPI Metrics */}
      <StatsCards logs={logs} patients={patients} />

      {/* Quick Access Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/doctor"
          className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900/60 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-200 group shadow-lg"
        >
          <div className="p-3 rounded-xl bg-purple-900/50 text-purple-300 w-fit mb-3 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base flex items-center justify-between">
            <span>Staff Terminal</span>
            <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Simulate healthcare provider clinical record access and write audit proofs to Monad.
          </p>
        </Link>

        <Link
          href="/patient"
          className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-900/60 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-200 group shadow-lg"
        >
          <div className="p-3 rounded-xl bg-cyan-900/50 text-cyan-300 w-fit mb-3 group-hover:scale-110 transition-transform">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base flex items-center justify-between">
            <span>Patient Portal</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Allow patients to review who accessed their data, inspect clinical reasons, and manage consent.
          </p>
        </Link>

        <Link
          href="/verify"
          className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-200 group shadow-lg"
        >
          <div className="p-3 rounded-xl bg-emerald-900/50 text-emerald-300 w-fit mb-3 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base flex items-center justify-between">
            <span>Record Verifier</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Upload files or paste SHA-256 hashes to verify tamper-free integrity against the blockchain.
          </p>
        </Link>

        <Link
          href="/audit"
          className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-200 group shadow-lg"
        >
          <div className="p-3 rounded-xl bg-indigo-900/50 text-indigo-300 w-fit mb-3 group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base flex items-center justify-between">
            <span>Audit Explorer</span>
            <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Inspect all on-chain transactions, filter by department, doctor role, or emergency overrides.
          </p>
        </Link>
      </div>

      {/* Live Recent Activity Stream */}
      <RecentActivityFeed logs={logs} />
    </div>
  );
}
