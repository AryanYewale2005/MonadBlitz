import React from 'react';
import { ShieldCheck, FileText, AlertTriangle, Users, ArrowUpRight } from 'lucide-react';
import { AccessLog } from '@/types/accessLog';
import { PatientProfile } from '@/types/patient';

interface StatsCardsProps {
  logs: AccessLog[];
  patients: PatientProfile[];
}

export default function StatsCards({ logs, patients }: StatsCardsProps) {
  const totalLogs = logs?.length || 0;
  const emergencyLogs = (logs || []).filter((l) => l.accessType === 'EMERGENCY_OVERRIDE').length;
  const verifiedRate = totalLogs > 0 ? Math.round(((totalLogs - emergencyLogs) / totalLogs) * 100) : 100;
  const totalRecords = (patients || []).reduce((acc, p) => acc + (p?.records?.length || 0), 0);

  const stats = [
    {
      title: 'Total Monad Access Logs',
      value: totalLogs.toString(),
      change: '+100% Tamper Proof',
      desc: 'Cryptographic events indexed on-chain',
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'Monitored Patient Records',
      value: totalRecords.toString(),
      change: `${patients.length} Active Profiles`,
      desc: 'Off-chain records anchored via SHA-256',
      icon: Users,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40',
      borderColor: 'border-cyan-500/30',
    },
    {
      title: 'Consent Compliance Rate',
      value: `${verifiedRate}%`,
      change: 'Pre-authorized',
      desc: 'Accesses authenticated by patient consent',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'Emergency Overrides',
      value: emergencyLogs.toString(),
      change: emergencyLogs > 0 ? 'High Priority' : 'Zero Incidents',
      desc: 'Trauma protocol bypass events logged',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`p-5 rounded-2xl bg-slate-900/60 border ${stat.borderColor} backdrop-blur-sm shadow-lg hover:border-slate-600 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{stat.title}</span>
              <div className={`p-2 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">{stat.value}</span>
              <span className={`text-[11px] font-semibold flex items-center ${stat.color}`}>
                {stat.change}
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{stat.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
