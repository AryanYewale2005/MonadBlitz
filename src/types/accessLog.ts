export type AccessType = 'READ' | 'UPDATE' | 'EXPORT' | 'EMERGENCY_OVERRIDE';

export type StaffRole = 
  | 'Attending Physician'
  | 'Chief Surgeon'
  | 'Cardiologist'
  | 'Emergency Physician'
  | 'Radiologist'
  | 'Oncologist'
  | 'Registered Nurse'
  | 'Clinical Pharmacist'
  | 'HIPAA Compliance Auditor'
  | 'Medical Researcher';

export type Department = 
  | 'Cardiology'
  | 'Emergency Medicine'
  | 'Radiology & Imaging'
  | 'Oncology'
  | 'Intensive Care Unit'
  | 'Surgical Services'
  | 'Pharmacy'
  | 'Internal Medicine'
  | 'Compliance & Legal';

export interface AccessLog {
  id: number;
  recordHash: string;          // 0x... 32-byte hash
  patientId: string;           // e.g. "PAT-7829"
  patientName?: string;        // Local display only (never on-chain for privacy)
  recordTitle?: string;        // e.g. "Cardiac MRI & Echo Report"
  requesterAddress: string;    // Monad EVM address
  staffName: string;           // e.g. "Dr. Aris Thorne, MD"
  staffRole: StaffRole;
  department: Department;
  reason: string;              // Clinical justification
  accessType: AccessType;
  timestamp: number;           // Unix seconds
  blockNumber: number;         // Monad block number
  txHash: string;              // Monad transaction hash
  consentVerified: boolean;    // Pre-authorized consent or emergency override
  isEmergencyOverride?: boolean;
}

export interface AccessVerificationResult {
  recordHash: string;
  isTamperFree: boolean;
  totalAccesses: number;
  firstAccessTimestamp?: number;
  lastAccessTimestamp?: number;
  matchingLogs: AccessLog[];
}
