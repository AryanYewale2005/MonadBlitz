'use client';

import React, { useState } from 'react';
import { useAccessLogger } from '@/hooks/useAccessLogger';
import { useWallet } from '@/hooks/useWallet';
import { AccessType, StaffRole, Department } from '@/types/accessLog';
import { calculateSHA256 } from '@/lib/crypto';
import { formatHash } from '@/lib/utils';
import { Stethoscope, ShieldAlert, CheckCircle2, ArrowRight, FileText, Loader2, Sparkles, ExternalLink } from 'lucide-react';

const STAFF_ROLES: StaffRole[] = [
  'Attending Physician',
  'Chief Surgeon',
  'Cardiologist',
  'Emergency Physician',
  'Radiologist',
  'Oncologist',
  'Registered Nurse',
  'Clinical Pharmacist',
  'HIPAA Compliance Auditor',
  'Medical Researcher',
];

const DEPARTMENTS: Department[] = [
  'Cardiology',
  'Emergency Medicine',
  'Radiology & Imaging',
  'Oncology',
  'Intensive Care Unit',
  'Surgical Services',
  'Pharmacy',
  'Internal Medicine',
  'Compliance & Legal',
];

export default function DoctorAccessTerminal() {
  const { patients, logAccess, isSubmitting, currentBlockNumber } = useAccessLogger();
  const { address } = useWallet();

  // Form states
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'PAT-7829');
  const [selectedRecordId, setSelectedRecordId] = useState<string>(patients[0]?.records[0]?.id || 'REC-9401');
  const [staffName, setStaffName] = useState<string>('Dr. Aris Thorne, MD');
  const [staffRole, setStaffRole] = useState<StaffRole>('Radiologist');
  const [department, setDepartment] = useState<Department>('Radiology & Imaging');
  const [reason, setReason] = useState<string>('Diagnostic follow-up: volumetric assessment for post-operative recovery protocol.');
  const [accessType, setAccessType] = useState<AccessType>('READ');
  const [customRecordTitle, setCustomRecordTitle] = useState<string>('');
  const [customContent, setCustomContent] = useState<string>('');

  // Result state
  const [lastLoggedTx, setLastLoggedTx] = useState<{
    txHash: string;
    logId: number;
    patientId: string;
    recordHash: string;
    timestamp: number;
  } | null>(null);

  // Selected patient profile & record
  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const currentRecord = currentPatient?.records.find((r) => r.id === selectedRecordId) || currentPatient?.records?.[0];

  if (!currentPatient) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    let targetHash = currentRecord?.sha256Hash;
    let targetTitle = currentRecord?.title;

    if (customContent.trim()) {
      targetHash = await calculateSHA256(customContent);
      targetTitle = customRecordTitle || 'Custom EHR Document';
    }

    const res = await logAccess({
      recordHash: targetHash || '0x9b3e6f821d4c79802a4d98e154f8b2c5890aefd91456bc91e3271109a1bf042b',
      patientId: currentPatient.id,
      patientName: currentPatient.fullName,
      recordTitle: targetTitle,
      staffName,
      staffRole,
      department,
      reason,
      accessType,
      walletAddress: address,
    });

    if (res.success) {
      setLastLoggedTx({
        txHash: res.txHash,
        logId: res.logId,
        patientId: currentPatient.id,
        recordHash: targetHash || '',
        timestamp: Math.floor(Date.now() / 1000),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Healthcare Staff Access Terminal</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Request and commit authorized access to patient records directly to the Monad blockchain.
          </p>
        </div>

        {/* Monad Live Block Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-mono text-purple-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Targeting Monad Block #{currentBlockNumber}</span>
        </div>
      </div>

      {/* Main Form & Record Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Access Request Form */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Staff Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Healthcare Professional Name
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Clinical Role
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as StaffRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  {STAFF_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department & Access Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hospital Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Access Intent / Type
                </label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value as AccessType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="READ">READ (View Record)</option>
                  <option value="UPDATE">UPDATE (Amend Diagnosis / Care Plan)</option>
                  <option value="EXPORT">EXPORT (Referral / Transfer of Care)</option>
                  <option value="EMERGENCY_OVERRIDE">EMERGENCY OVERRIDE (Trauma Code Red)</option>
                </select>
              </div>
            </div>

            {/* Patient & Record Selection */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Patient Profile
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => {
                      setSelectedPatientId(e.target.value);
                      const p = patients.find((pat) => pat.id === e.target.value);
                      if (p && p.records.length > 0) {
                        setSelectedRecordId(p.records[0].id);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-sm focus:border-purple-500 focus:outline-none font-medium"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Clinical Record
                  </label>
                  <select
                    value={selectedRecordId}
                    onChange={(e) => setSelectedRecordId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none truncate"
                  >
                    {currentPatient?.records.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Clinical Justification / Reason */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Clinical Reason for Access (HIPAA Mandated)
                </label>
                <span className="text-[11px] text-purple-400">Required for on-chain audit</span>
              </div>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Pre-operative cardiac clearance, emergency stabilization, medication review..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              />
            </div>

            {/* Emergency Warning */}
            {accessType === 'EMERGENCY_OVERRIDE' && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-200">
                  <span className="font-bold block text-rose-300">Emergency Override Protocol Active</span>
                  This request bypasses normal pre-authorization consent under emergency trauma protocols. An immutable high-priority flag will be committed to Monad and reviewed by the compliance auditor.
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-purple-900/40 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Committing Proof to Monad Parallel EVM (~1s)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Commit Access Proof to Monad</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: Off-Chain Document Preview & Hash Card */}
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Off-Chain EMR Preview</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Selected Patient</span>
                <div className="font-semibold text-white">{currentPatient?.fullName}</div>
                <div className="text-slate-400 font-mono text-[11px]">DOB: {currentPatient?.dateOfBirth} • {currentPatient?.bloodType}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Medical Document</span>
                <div className="font-semibold text-cyan-300">{currentRecord?.title}</div>
                <p className="text-slate-400 text-[11px] line-clamp-3 mt-1">
                  {currentRecord?.summary}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Off-Chain SHA-256 Signature</span>
                <div className="font-mono text-cyan-400 text-[11px] break-all bg-slate-900 p-2 rounded border border-slate-800">
                  {currentRecord?.sha256Hash}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  🔒 Document remains securely off-chain. Only this hash is sent to Monad.
                </span>
              </div>
            </div>
          </div>

          {/* Success Box if just logged */}
          {lastLoggedTx && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-xl space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Monad Access Proof Confirmed!</span>
              </div>
              <p className="text-slate-300 text-xs font-mono">
                Log ID: #{lastLoggedTx.logId}
              </p>
              <div className="text-[11px] text-slate-400 font-mono break-all bg-slate-950/80 p-2 rounded border border-emerald-500/20">
                Tx: {formatHash(lastLoggedTx.txHash, 10)}
              </div>
              <a
                href={`https://testnet.monadexplorer.com/tx/${lastLoggedTx.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 font-medium pt-1"
              >
                <span>View on Monad Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
