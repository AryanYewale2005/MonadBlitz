import { PatientProfile } from '@/types/patient';
import { AccessLog } from '@/types/accessLog';

export const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'PAT-7829',
    fullName: 'Eleanor Vance',
    dateOfBirth: '1984-04-12',
    bloodType: 'O-Positive',
    primaryPhysician: 'Dr. Sarah Lin, MD (Chief Neurologist)',
    records: [
      {
        id: 'REC-9401',
        patientId: 'PAT-7829',
        title: 'Contrast Enhanced Brain MRI & Angiography',
        category: 'Diagnostic',
        dateCreated: '2026-08-14',
        department: 'Radiology & Imaging',
        physicianInCharge: 'Dr. Aris Thorne, MD',
        sha256Hash: '0x9b3e6f821d4c79802a4d98e154f8b2c5890aefd91456bc91e3271109a1bf042b',
        summary: '3 Tesla axial and coronal scans showing resolved frontotemporal micro-vascular ischemia. No acute lesions.',
        fileSizeBytes: 4280194,
      },
      {
        id: 'REC-9402',
        patientId: 'PAT-7829',
        title: 'Comprehensive Metabolic Panel & Lipid Profile',
        category: 'Lab Result',
        dateCreated: '2026-09-02',
        department: 'Internal Medicine',
        physicianInCharge: 'Dr. Sarah Lin, MD',
        sha256Hash: '0x4c2f88a911e35490bc1f928e452a38b4d817f309a65bc828816f1c4e7081da23',
        summary: 'Fasting glucose 92 mg/dL, HbA1c 5.4%, eGFR >90 mL/min/1.73m². All biomarkers within standard reference range.',
        fileSizeBytes: 620450,
      },
      {
        id: 'REC-9403',
        patientId: 'PAT-7829',
        title: 'High-Risk Surgical Clearance Evaluation',
        category: 'Surgical Note',
        dateCreated: '2026-09-15',
        department: 'Surgical Services',
        physicianInCharge: 'Dr. Marcus Vance, MD',
        sha256Hash: '0x7e810a43bc92df5638190ba3244e89f1a07d612e43bc91f8271a5c60238e91cd',
        summary: 'Pre-operative assessment cleared for minor lumbar decompression under monitored anesthesia.',
        fileSizeBytes: 1205800,
      }
    ],
    activeConsentDoctors: [
      {
        address: '0x88f219b2605E4143D1A39b69bF989826cD59bF3B',
        doctorName: 'Dr. Sarah Lin, MD',
        role: 'Chief Neurologist',
        department: 'Internal Medicine',
        expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
      },
      {
        address: '0x42A398205C6c7F64f9b819A2E7d192B41369fA90',
        doctorName: 'Dr. Aris Thorne, MD',
        role: 'Radiologist',
        department: 'Radiology & Imaging',
        expiresAt: Math.floor(Date.now() / 1000) + 86400 * 14, // 14 days
      }
    ]
  },
  {
    id: 'PAT-4102',
    fullName: 'Robert Sterling',
    dateOfBirth: '1968-11-29',
    bloodType: 'A-Positive',
    primaryPhysician: 'Dr. Julian Thorne, MD (Interventional Cardiologist)',
    records: [
      {
        id: 'REC-8201',
        patientId: 'PAT-4102',
        title: 'Transthoracic Echocardiogram (TTE) & Doppler',
        category: 'Diagnostic',
        dateCreated: '2026-08-28',
        department: 'Cardiology',
        physicianInCharge: 'Dr. Julian Thorne, MD',
        sha256Hash: '0x3a5f9921bc4e082194f83b6289d0ac6152bc478190efb2a8570192e47810b429',
        summary: 'Ejection fraction 62%. Normal left ventricular systolic function. Mild mitral regurgitation, hemodynamically stable.',
        fileSizeBytes: 8910400,
      },
      {
        id: 'REC-8202',
        patientId: 'PAT-4102',
        title: 'Whole Genome Sequencing & Pharmacogenomic Panel',
        category: 'Genomics',
        dateCreated: '2026-09-10',
        department: 'Oncology',
        physicianInCharge: 'Dr. Elena Rostova, PhD, MD',
        sha256Hash: '0x5d92e104f76ba89c3140be5421a9d82138bc42f1a60e891c42f78b1089ca201e',
        summary: 'CYP2C19 extensive metabolizer status. Recommended clopidogrel standard therapeutic dosing protocol.',
        fileSizeBytes: 14209500,
      }
    ],
    activeConsentDoctors: [
      {
        address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        doctorName: 'Dr. Julian Thorne, MD',
        role: 'Interventional Cardiologist',
        department: 'Cardiology',
        expiresAt: Math.floor(Date.now() / 1000) + 86400 * 60,
      }
    ]
  },
  {
    id: 'PAT-9934',
    fullName: 'Sophia Chen-Alvarez',
    dateOfBirth: '1995-07-03',
    bloodType: 'B-Negative',
    primaryPhysician: 'Dr. Maya Patel, MD (Emergency Medicine)',
    records: [
      {
        id: 'REC-3011',
        patientId: 'PAT-9934',
        title: 'Emergency Trauma Whole Body CT Scan',
        category: 'Diagnostic',
        dateCreated: '2026-09-18',
        department: 'Emergency Medicine',
        physicianInCharge: 'Dr. Maya Patel, MD',
        sha256Hash: '0x1b72a940ec61394f80129bc834ef19a071d492bc60e8913b76402ef94108ca77',
        summary: 'Emergency trauma assessment following MVA. Cervical spine intact. No pneumothorax or active peritoneal extravasation.',
        fileSizeBytes: 22409100,
      }
    ],
    activeConsentDoctors: []
  }
];

export const INITIAL_LOGS: AccessLog[] = [
  {
    id: 1042,
    recordHash: '0x9b3e6f821d4c79802a4d98e154f8b2c5890aefd91456bc91e3271109a1bf042b',
    patientId: 'PAT-7829',
    patientName: 'Eleanor Vance',
    recordTitle: 'Contrast Enhanced Brain MRI & Angiography',
    requesterAddress: '0x42A398205C6c7F64f9b819A2E7d192B41369fA90',
    staffName: 'Dr. Aris Thorne, MD',
    staffRole: 'Radiologist',
    department: 'Radiology & Imaging',
    reason: 'Secondary neurovascular diagnostic consultation and volumetric comparison with 2025 scan.',
    accessType: 'READ',
    timestamp: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    blockNumber: 14890214,
    txHash: '0x8a921d7b34e569c01fe45290bca781920ef198a24c568910dca29810bf209a11',
    consentVerified: true,
  },
  {
    id: 1043,
    recordHash: '0x3a5f9921bc4e082194f83b6289d0ac6152bc478190efb2a8570192e47810b429',
    patientId: 'PAT-4102',
    patientName: 'Robert Sterling',
    recordTitle: 'Transthoracic Echocardiogram (TTE) & Doppler',
    requesterAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    staffName: 'Dr. Julian Thorne, MD',
    staffRole: 'Cardiologist',
    department: 'Cardiology',
    reason: 'Pre-procedural assessment ahead of cardiac rehabilitation discharge.',
    accessType: 'READ',
    timestamp: Math.floor(Date.now() / 1000) - 3400, // 56 mins ago
    blockNumber: 14893814,
    txHash: '0xd319e072b4f910ca5402198be4c910245a819bcf891024a7190ca52890ef1482',
    consentVerified: true,
  },
  {
    id: 1044,
    recordHash: '0x1b72a940ec61394f80129bc834ef19a071d492bc60e8913b76402ef94108ca77',
    patientId: 'PAT-9934',
    patientName: 'Sophia Chen-Alvarez',
    recordTitle: 'Emergency Trauma Whole Body CT Scan',
    requesterAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    staffName: 'Dr. Maya Patel, MD',
    staffRole: 'Emergency Physician',
    department: 'Emergency Medicine',
    reason: 'EMERGENCY PROTOCOL CODE RED: Urgent access required for acute polytrauma stabilization.',
    accessType: 'EMERGENCY_OVERRIDE',
    timestamp: Math.floor(Date.now() / 1000) - 1100, // 18 mins ago
    blockNumber: 14896114,
    txHash: '0xf7810a92b45091cde40192bca71092ef54019b821049ea28910fa348109bf410',
    consentVerified: false,
    isEmergencyOverride: true,
  },
  {
    id: 1045,
    recordHash: '0x4c2f88a911e35490bc1f928e452a38b4d817f309a65bc828816f1c4e7081da23',
    patientId: 'PAT-7829',
    patientName: 'Eleanor Vance',
    recordTitle: 'Comprehensive Metabolic Panel & Lipid Profile',
    requesterAddress: '0x88f219b2605E4143D1A39b69bF989826cD59bF3B',
    staffName: 'Dr. Sarah Lin, MD',
    staffRole: 'Attending Physician',
    department: 'Internal Medicine',
    reason: 'Routine quarterly medication review and dosage adjustment for antihypertensive therapy.',
    accessType: 'UPDATE',
    timestamp: Math.floor(Date.now() / 1000) - 320, // 5 mins ago
    blockNumber: 14896894,
    txHash: '0x55019a82e1c940bfa18204bca91038590124fe819bc4510481029cfa8102b541',
    consentVerified: true,
  }
];
