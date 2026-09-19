import { ethers } from 'ethers';

/**
 * Calculates SHA-256 hash of a string or file content
 */
export async function calculateSHA256(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex;
}

/**
 * Calculates SHA-256 hash of a File object (e.g. uploaded medical report PDF or DICOM image)
 */
export async function calculateFileSHA256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex;
}

/**
 * Calculates Keccak-256 hash (EVM native bytes32 format)
 */
export function calculateKeccak256(content: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(content));
}

/**
 * Normalizes any hash to a valid bytes32 hex string
 */
export function normalizeBytes32(hash: string): string {
  if (!hash) return ethers.ZeroHash;
  if (!hash.startsWith('0x')) hash = '0x' + hash;
  if (hash.length === 66) return hash; // already 32 bytes (64 hex chars + 0x)
  return ethers.keccak256(ethers.toUtf8Bytes(hash));
}

export { formatHash, formatAddress } from './utils';
