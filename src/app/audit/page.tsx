'use client';

import React from 'react';
import AuditLogTable from '@/components/logs/AuditLogTable';
import { useAccessLogger } from '@/hooks/useAccessLogger';
import { Search, ShieldAlert, Cpu } from 'lucide-react';

export default function AuditPage() {
  const { logs } = useAccessLogger();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-400">
              <Search className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Global Audit Log Explorer</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse and cryptographically verify all medical record access transactions anchored to the Monad EVM.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-300">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>{logs.length} Immutable Monad Records</span>
        </div>
      </div>

      {/* Main Filterable Table */}
      <AuditLogTable logs={logs} />
    </div>
  );
}
