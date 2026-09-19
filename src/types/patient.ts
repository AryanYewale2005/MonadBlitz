export interface MedicalRecord {
  id: string;                  // e.g. "REC-9401"
  patientId: string;           // e.g. "PAT-7829"
  title: string;               // e.g. "Contrast Enhanced Brain MRI"
  category: 'Diagnostic' | 'Lab Result' | 'Surgical Note' | 'Prescription' | 'Genomics';
  dateCreated: string;
  department: string;
  physicianInCharge: string;
  sha256Hash: string;          // Off-chain content cryptographic signature
  summary: string;             // Clinical brief
  fileSizeBytes: number;
}

export interface PatientProfile {
  id: string;                  // e.g. "PAT-7829"
  fullName: string;
  dateOfBirth: string;
  bloodType: string;
  primaryPhysician: string;
  records: MedicalRecord[];
  activeConsentDoctors: {
    address: string;
    doctorName: string;
    role: string;
    department: string;
    expiresAt: number; // Unix timestamp
  }[];
}
