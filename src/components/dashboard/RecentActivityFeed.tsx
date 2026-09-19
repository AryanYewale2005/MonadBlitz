import React from 'react';
import Link from 'next/link';
import { AccessLog } from '@/types/accessLog';
import { formatAddress, formatHash, timeAgo } from '@/lib/utils';
import { ShieldCheck, AlertCircle, ArrowRight, ExternalLink, Activity } from 'lucide-react';

interface RecentActivityFeedProps {
  logs: AccessLog[];
}

export default function RecentActivityFeed({ logs }: RecentActivityFeedProps) {
  const recent = (logs || []).slice(0, 5);

  const getAccessBadge = (type: string) => {
    switch (type) {
      case 'READ':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">READ</span>;
      case 'UPDATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">UPDATE</span>;
      case 'EXPORT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">EXPORT</span>;
      case 'EMERGENCY_OVERRIDE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">EMERGENCY OVERRIDE</span>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Live Monad Access Stream</h3>
        </div>
        <Link
          href="/audit"
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>View All Logs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/80">
        {recent.map((log) => (
          <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                {getAccessBadge(log.accessType)}
                <span className="text-xs font-semibold text-white">{log.staffName}</span>
                <span className="text-[11px] text-slate-400">({log.staffRole})</span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-cyan-300 font-mono">{log.patientId}</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 italic">
                &ldquo;{log.reason}&rdquo;
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                <span>Record Hash: {formatHash(log.recordHash)}</span>
                <span>Tx: {formatHash(log.txHash)}</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
              <span className="text-xs text-slate-400 font-mono">{timeAgo(log.timestamp)}</span>
              <div className="flex items-center gap-1.5">
                {log.consentVerified ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Consent Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    Emergency Bypass
                  </span>
                )}
                <Link
                  href={`/verify?hash=${log.recordHash}`}
                  title="Verify on Monad"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
