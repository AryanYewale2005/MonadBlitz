'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRecordVerifier } from '@/hooks/useRecordVerifier';
import { formatAddress, formatHash, formatTimestamp } from '@/lib/utils';
import { CheckCircle2, ShieldAlert, UploadCloud, Search, FileText, Check, Clock, ExternalLink, ArrowRight } from 'lucide-react';

export default function RecordVerifier() {
  const searchParams = useSearchParams();
  const initialHash = searchParams.get('hash') || '';

  const { isVerifying, result, verifyHash, verifyFile, verifyTextContent, resetVerification } = useRecordVerifier();
  const [hashInput, setHashInput] = useState<string>(initialHash);
  const [textContent, setTextContent] = useState<string>('');
  const [tab, setTab] = useState<'hash' | 'file' | 'text'>('hash');
  const [fileName, setFileName] = useState<string | null>(null);

  // Auto-verify if hash was provided in URL query parameter
  useEffect(() => {
    if (initialHash) {
      setHashInput(initialHash);
      verifyHash(initialHash);
    }
  }, [initialHash]);

  const handleHashSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hashInput.trim()) return;
    verifyHash(hashInput.trim());
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      await verifyFile(file);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) return;
    await verifyTextContent(textContent);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Cryptographic Record Verifier</h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Verify medical record integrity against the Monad blockchain without exposing confidential patient data.
        </p>
      </div>

      {/* Input Mode Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => { setTab('hash'); resetVerification(); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            tab === 'hash'
              ? 'bg-purple-900/50 text-purple-200 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Verify by Hash
        </button>

        <button
          onClick={() => { setTab('file'); resetVerification(); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            tab === 'file'
              ? 'bg-purple-900/50 text-purple-200 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Upload Medical File / PDF
        </button>

        <button
          onClick={() => { setTab('text'); resetVerification(); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            tab === 'text'
              ? 'bg-purple-900/50 text-purple-200 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Verify Text Content
        </button>
      </div>

      {/* Tab 1: Verify by Hash */}
      {tab === 'hash' && (
        <form onSubmit={handleHashSubmit} className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Enter 32-Byte SHA-256 or Keccak-256 Record Hash
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="0x9b3e6f821d4c79802a4d98e154f8b2c5890aefd91456bc91e3271109a1bf042b"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                required
                className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-cyan-300 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Try with sample Brain MRI hash:</span>
              <button
                type="button"
                onClick={() => {
                  const sample = '0x9b3e6f821d4c79802a4d98e154f8b2c5890aefd91456bc91e3271109a1bf042b';
                  setHashInput(sample);
                  verifyHash(sample);
                }}
                className="text-purple-400 hover:underline font-mono"
              >
                Paste Sample Hash
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Upload File */}
      {tab === 'file' && (
        <div className="p-8 rounded-2xl bg-slate-900/70 border border-dashed border-slate-700 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Upload Medical Report or Diagnostic Scan</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Your file is never uploaded to any remote server. It is hashed locally in your browser to verify against Monad.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-md shadow-purple-900/30">
            <span>Select Local File</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
          {fileName && <p className="text-xs font-mono text-cyan-300">File: {fileName}</p>}
        </div>
      )}

      {/* Tab 3: Text Content */}
      {tab === 'text' && (
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Paste Clinical Note or Report Transcript
            </label>
            <textarea
              rows={4}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste raw medical report content to calculate cryptographic SHA-256 fingerprint..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
            >
              Calculate SHA-256 & Verify on Monad
            </button>
          </div>
        </form>
      )}

      {/* Verification Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Status Badge Card */}
          <div
            className={`p-6 rounded-2xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              result.isTamperFree
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl border ${
                  result.isTamperFree
                    ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400'
                    : 'bg-rose-950 border-rose-500/50 text-rose-400'
                }`}
              >
                {result.isTamperFree ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <ShieldAlert className="w-8 h-8" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {result.isTamperFree
                    ? 'Cryptographically Verified on Monad'
                    : 'No On-Chain Record Found / Potential Tampering'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {result.isTamperFree
                    ? `This off-chain record has ${result.totalAccesses} immutable access transaction(s) logged on Monad.`
                    : 'The calculated cryptographic hash does not match any registered medical record in the Monad ledger.'}
                </p>
              </div>
            </div>

            {/* Verification Stats */}
            {result.isTamperFree && (
              <div className="flex items-center gap-4 text-xs font-mono bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Reads</span>
                  <span className="font-bold text-white text-sm">{result.totalAccesses}</span>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <span className="text-slate-400 block text-[10px]">First Access</span>
                  <span className="text-slate-300">
                    {result.firstAccessTimestamp ? formatTimestamp(result.firstAccessTimestamp) : 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Access History Breakdown */}
          {result.isTamperFree && result.matchingLogs.length > 0 && (
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Complete Monad Access History</h3>
                <span className="text-xs font-mono text-purple-300">
                  {result.matchingLogs.length} Events Recorded
                </span>
              </div>

              <div className="divide-y divide-slate-800/80">
                {result.matchingLogs.map((log) => (
                  <div key={log.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {log.accessType}
                        </span>
                        <span className="font-semibold text-white text-xs">{log.staffName}</span>
                        <span className="text-slate-400 text-xs">({log.staffRole})</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-cyan-300 text-xs font-mono">{log.department}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{formatTimestamp(log.timestamp)}</span>
                    </div>

                    <p className="text-xs text-slate-300 italic">
                      &ldquo;{log.reason}&rdquo;
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono text-slate-400 pt-1">
                      <span>Requester: {formatAddress(log.requesterAddress)}</span>
                      <span>Monad Tx: {formatHash(log.txHash)}</span>
                      <a
                        href={`https://testnet.monadexplorer.com/tx/${log.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <span>Explorer</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
