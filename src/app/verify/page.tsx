import React, { Suspense } from 'react';
import RecordVerifier from '@/components/verify/RecordVerifier';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Cryptographic Record Verifier | Monad Medical Logger',
  description: 'Verify off-chain medical record integrity and audit trail on the Monad blockchain.',
};

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
          <span>Loading cryptographic verifier...</span>
        </div>
      }
    >
      <RecordVerifier />
    </Suspense>
  );
}
