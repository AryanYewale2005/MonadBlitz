import React from 'react';
import PatientPortal from '@/components/patient/PatientPortal';

export const metadata = {
  title: 'Patient Privacy & Consent | Monad Medical Logger',
  description: 'Manage patient consent and review transparent on-chain medical access history.',
};

export default function PatientPage() {
  return <PatientPortal />;
}
