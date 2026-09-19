'use client';

import { useState } from 'react';
import { AccessVerificationResult } from '@/types/accessLog';
import { useAccessLogger } from './useAccessLogger';
import { calculateFileSHA256, calculateSHA256, normalizeBytes32 } from '@/lib/crypto';

export function useRecordVerifier() {
  const { logs } = useAccessLogger();
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<AccessVerificationResult | null>(null);

  const verifyHash = (hash: string): AccessVerificationResult => {
    setIsVerifying(true);
    const normalized = normalizeBytes32(hash.trim().toLowerCase());
    
    // Find matching logs
    const matches = logs.filter(
      (l) => l.recordHash.toLowerCase() === normalized || l.recordHash.toLowerCase() === hash.toLowerCase()
    );

    const exists = matches.length > 0;
    const timestamps = matches.map((m) => m.timestamp).sort((a, b) => a - b);

    const verificationResult: AccessVerificationResult = {
      recordHash: normalized,
      isTamperFree: exists,
      totalAccesses: matches.length,
      firstAccessTimestamp: timestamps[0],
      lastAccessTimestamp: timestamps[timestamps.length - 1],
      matchingLogs: matches,
    };

    setResult(verificationResult);
    setIsVerifying(false);
    return verificationResult;
  };

  const verifyTextContent = async (content: string) => {
    setIsVerifying(true);
    const hash = await calculateSHA256(content);
    return verifyHash(hash);
  };

  const verifyFile = async (file: File) => {
    setIsVerifying(true);
    const hash = await calculateFileSHA256(file);
    return verifyHash(hash);
  };

  const resetVerification = () => {
    setResult(null);
  };

  return {
    isVerifying,
    result,
    verifyHash,
    verifyTextContent,
    verifyFile,
    resetVerification,
  };
}
