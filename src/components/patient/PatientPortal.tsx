'use client';

import React, { useState } from 'react';
import { useAccessLogger } from '@/hooks/useAccessLogger';
import { formatAddress, formatHash, formatTimestamp } from '@/lib/utils';
import { UserCheck, Shield, ShieldAlert, KeyRound, Plus, Trash2, CheckCircle2, Clock, Lock } from 'lucide-react';

export default function PatientPortal() {
  const { patients, logs, grantConsent, revokeConsent } = useAccessLogger();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'PAT-7829');

  // New Consent Form State
  const [showGrantModal, setShowGrantModal] = useState<boolean>(false);
  const [newDoctorAddress, setNewDoctorAddress] = useState<string>('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [newDoctorName, setNewDoctorName] = useState<string>('Dr. Elena Rostova, PhD, MD');
  const [newDoctorRole, setNewDoctorRole] = useState<string>('Oncologist');
  const [newDepartment, setNewDepartment] = useState<string>('Oncology');
  const [durationDays, setDurationDays] = useState<number>(30);

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const patientLogs = currentPatient ? logs.filter((l) => l.patientId === currentPatient.id) : [];

  if (!currentPatient) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const handleGrantConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorAddress || !newDoctorName) return;

    grantConsent(currentPatient.id, {
      address: newDoctorAddress,
      doctorName: newDoctorName,
      role: newDoctorRole,
      department: newDepartment,
      durationDays,
    });

    setShowGrantModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & Patient Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Patient Privacy & Consent Portal</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Review who has accessed your medical records and manage cryptographic access permissions.
          </p>
        </div>

        {/* Patient Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Active Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-semibold text-sm focus:border-purple-500 focus:outline-none"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Patient Name</span>
          <span className="text-lg font-bold text-white">{currentPatient.fullName}</span>
          <span className="text-xs font-mono text-cyan-400 block mt-0.5">ID: {currentPatient.id}</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Date of Birth & Blood Group</span>
          <span className="text-sm font-semibold text-white">{currentPatient.dateOfBirth}</span>
          <span className="text-xs font-mono text-slate-300 block mt-0.5">Type: {currentPatient.bloodType}</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Primary Physician</span>
          <span className="text-sm font-semibold text-white">{currentPatient.primaryPhysician}</span>
          <span className="text-xs text-emerald-400 block mt-0.5">Continuous Consent</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Monitored EMR Records</span>
          <span className="text-lg font-bold font-mono text-purple-300">{currentPatient.records.length} Documents</span>
          <span className="text-xs text-slate-400 block mt-0.5">Off-Chain Anchored</span>
        </div>
      </div>

      {/* Consent Management Section */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-400" />
            <h2 className="text-base font-semibold text-white">Active On-Chain Doctor Consents</h2>
          </div>
          <button
            onClick={() => setShowGrantModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Grant New Doctor Consent</span>
          </button>
        </div>

        {currentPatient.activeConsentDoctors.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950 text-slate-400 text-xs text-center border border-slate-800">
            No active physician consents granted. All standard non-emergency accesses will be blocked.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPatient.activeConsentDoctors.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{doc.doctorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {doc.role} • {doc.department}
                  </div>
                  <div className="text-[11px] font-mono text-purple-300 mt-1">
                    Address: {formatAddress(doc.address)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Expires: {formatTimestamp(doc.expiresAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => revokeConsent(currentPatient.id, doc.address)}
                  title="Revoke doctor's access permission"
                  className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patient Specific Access Log History */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-semibold text-white">Immutable Access Record for {currentPatient.fullName}</h2>
        </div>

        {patientLogs.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-950 text-slate-400 text-xs text-center border border-slate-800">
            No access history recorded on Monad for this patient.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {patientLogs.map((log) => (
              <div key={log.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-300">Log #{log.id}</span>
                    <span className="text-xs font-semibold text-white">{log.staffName}</span>
                    <span className="text-[11px] text-slate-400">({log.staffRole} - {log.department})</span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic">
                  Clinical Justification: &ldquo;{log.reason}&rdquo;
                </p>

                <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] pt-1">
                  <div className="flex items-center gap-2 font-mono text-slate-400">
                    <span>Record: {log.recordTitle}</span>
                    <span>•</span>
                    <span>Tx: {formatHash(log.txHash)}</span>
                  </div>

                  <div>
                    {log.consentVerified ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Authorized via Consent
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 font-medium">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Emergency Override Bypass
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grant Consent Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-purple-500/40 rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-white mb-1">Grant Physician Consent</h3>
            <p className="text-xs text-slate-400 mb-4">
              Authorize a healthcare professional to access your records on Monad.
            </p>

            <form onSubmit={handleGrantConsent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Doctor Full Name & Degree</label>
                <input
                  type="text"
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Doctor Monad Wallet Address</label>
                <input
                  type="text"
                  value={newDoctorAddress}
                  onChange={(e) => setNewDoctorAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role / Specialization</label>
                  <input
                    type="text"
                    value={newDoctorRole}
                    onChange={(e) => setNewDoctorRole(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-900/30"
                >
                  Authorize On-Chain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
