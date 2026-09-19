import React from 'react';
import DoctorAccessTerminal from '@/components/staff/DoctorAccessTerminal';

export const metadata = {
  title: 'Staff Access Terminal | Monad Medical Logger',
  description: 'Authorized medical staff access terminal with cryptographic logging on Monad.',
};

export default function DoctorPage() {
  return <DoctorAccessTerminal />;
}
