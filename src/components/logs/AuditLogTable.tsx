'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AccessLog } from '@/types/accessLog';
import { formatAddress, formatHash, formatTimestamp } from '@/lib/utils';
import { Search, Filter, ShieldCheck, AlertTriangle, ExternalLink, X, Check, FileCode, Layers } from 'lucide-react';

interface AuditLogTableProps {
  logs: AccessLog[];
}

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);

  // Departments list from logs
  const departments = useMemo(() => {
    const set = new Set((logs || []).map((l) => l.department));
    return Array.from(set);
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return (logs || []).filter((log) => {
      const matchesSearch =
        log.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.recordHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.txHash.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'ALL' || log.accessType === selectedType;
      const matchesDept = selectedDepartment === 'ALL' || log.department === selectedDepartment;

      return matchesSearch && matchesType && matchesDept;
    });
  }, [logs, searchTerm, selectedType, selectedDepartment]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'READ':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">READ</span>;
      case 'UPDATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">UPDATE</span>;
      case 'EXPORT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">EXPORT</span>;
      case 'EMERGENCY_OVERRIDE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">EMERGENCY</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Patient ID, Doctor, Reason, Record Hash, or Tx..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Access Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-purple-500/60"
          >
            <option value="ALL">All Access Types</option>
            <option value="READ">Read</option>
            <option value="UPDATE">Update</option>
            <option value="EXPORT">Export</option>
            <option value="EMERGENCY_OVERRIDE">Emergency Override</option>
          </select>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-purple-500/60"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Log ID & Block</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Healthcare Staff</th>
              <th className="py-3.5 px-4">Patient & Record</th>
              <th className="py-3.5 px-4">Clinical Reason</th>
              <th className="py-3.5 px-4">Consent Status</th>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No matching access logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-purple-950/20 transition-colors duration-150 cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  {/* Log ID & Block */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-purple-300">#{log.id}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Blk: #{log.blockNumber}</div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getTypeBadge(log.accessType)}
                  </td>

                  {/* Healthcare Staff */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{log.staffName}</div>
                    <div className="text-[11px] text-slate-400">
                      {log.staffRole} • <span className="text-cyan-400/90">{log.department}</span>
                    </div>
                  </td>

                  {/* Patient & Record */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-xs font-semibold text-cyan-300">{log.patientId}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                      {log.recordTitle || 'Clinical Record'}
                    </div>
                  </td>

                  {/* Clinical Reason */}
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {log.reason}
                    </p>
                  </td>

                  {/* Consent Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {log.consentVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        Authorized
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        Override
                      </span>
                    )}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                    {formatTimestamp(log.timestamp)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Modal: Monad On-Chain Record Details */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-950 border border-purple-500/40 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Monad Access Proof #{selectedLog.id}</h3>
                  {getTypeBadge(selectedLog.accessType)}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Block #{selectedLog.blockNumber} • Monad Testnet
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-4 text-xs">
              {/* Row 1: Requester & Patient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block mb-1">Healthcare Requester</span>
                  <div className="font-semibold text-white text-sm">{selectedLog.staffName}</div>
                  <div className="text-slate-400">{selectedLog.staffRole} ({selectedLog.department})</div>
                  <div className="font-mono text-purple-300 mt-1">{formatAddress(selectedLog.requesterAddress, 6)}</div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Patient & Record Target</span>
                  <div className="font-semibold text-cyan-300 text-sm font-mono">{selectedLog.patientId}</div>
                  <div className="text-slate-300">{selectedLog.patientName}</div>
                  <div className="text-slate-400 text-[11px] mt-1">{selectedLog.recordTitle}</div>
                </div>
              </div>

              {/* Row 2: Clinical Reason */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Clinical Justification & Audit Purpose</span>
                <p className="text-white text-sm italic font-serif">
                  &ldquo;{selectedLog.reason}&rdquo;
                </p>
              </div>

              {/* Row 3: Cryptographic Proofs */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3 font-mono">
                <div>
                  <span className="text-slate-400 text-[11px] block">Off-Chain Record Hash (SHA-256 / Keccak-256)</span>
                  <div className="text-cyan-400 break-all select-all bg-slate-950 p-2 rounded mt-1 border border-slate-800">
                    {selectedLog.recordHash}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block">Monad Transaction Hash (Sub-Second Finality)</span>
                  <div className="text-purple-300 break-all select-all bg-slate-950 p-2 rounded mt-1 border border-slate-800">
                    {selectedLog.txHash}
                  </div>
                </div>
              </div>

              {/* Row 4: Verification & Consent Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[11px]">Patient Consent Authentication</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {selectedLog.consentVerified ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Active Patient Consent On-Chain
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Emergency Trauma Override
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/verify?hash=${selectedLog.recordHash}`}
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-2 transition-colors shadow-lg shadow-purple-900/30"
                >
                  <span>Verify Record Hash</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
