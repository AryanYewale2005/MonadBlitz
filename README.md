# 🏥 Medical Data Access Logger on Monad Blockchain

An enterprise-grade, privacy-first healthcare audit trail built on the ultra-high-performance **Monad blockchain** using **Next.js 15 (App Router, TypeScript, Tailwind CSS)** and **Solidity**.

---

## ⚡ The Healthcare Problem Solved

Centralized hospital systems and electronic health record (EHR) databases are prone to unauthorized snooping, undetectable data leaks, and insider tampering. 

**Our Solution**:
- **Zero Sensitive Data On-Chain**: Patient medical records (MRI scans, blood panels, clinical summaries) remain securely stored **off-chain** in compliance with HIPAA & GDPR.
- **Cryptographic Access Signatures**: Every time a physician, nurse, or auditor accesses a record, an immutable on-chain event is generated containing:
  - **Record Hash**: Off-chain 32-byte SHA-256 cryptographic digest.
  - **Requester Address & Identity**: Monad wallet address, physician name, role, and hospital department.
  - **Clinical Reason**: Mandatory justification for accessing patient data.
  - **Timestamp & Finality**: 1-second single-slot finality on the Monad parallel EVM.
  - **Consent Verification**: Automatic check against patient pre-authorized consents or flagged emergency trauma overrides.

---

## 🏗️ Maintainable Project Architecture

```
monad/
├── contracts/
│   ├── MedicalAccessLogger.sol       # Solidity smart contract with consent registry & tamper check
│   └── deploy.js                     # Monad Testnet deployment script
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout with Web3 providers, Navbar, and Footer
│   │   ├── page.tsx                  # Command Center & Live Blockchain Telemetry
│   │   ├── doctor/page.tsx           # Healthcare Staff Access Terminal
│   │   ├── patient/page.tsx          # Patient Privacy & Consent Manager
│   │   ├── audit/page.tsx            # Global Audit Log Explorer
│   │   ├── verify/page.tsx           # Cryptographic Record Verifier (File/Hash/Text)
│   │   └── globals.css               # Theme styling and Tailwind CSS
│   ├── components/
│   │   ├── common/                   # Navbar, Footer, Badges
│   │   ├── dashboard/                # Live Monad block counter, stats cards, activity feed
│   │   ├── logs/                     # AuditLogTable with deep search, filters, & TX inspector
│   │   ├── staff/                    # DoctorAccessTerminal with live EMR preview & SHA-256
│   │   ├── patient/                  # PatientPortal with consent grant/revoke & timeline
│   │   └── verify/                   # RecordVerifier with local file hashing & chain verification
│   ├── contracts/
│   │   ├── MedicalAccessLogger.json  # Exported contract ABI
│   │   └── addresses.ts              # Monad Testnet / Devnet contract mappings
│   ├── hooks/
│   │   ├── useWallet.ts              # MetaMask / Monad network connector & switcher
│   │   ├── useAccessLogger.ts        # Contract caller, log manager & Monad simulator
│   │   └── useRecordVerifier.ts      # Cryptographic hash verification against Monad
│   ├── lib/
│   │   ├── monad.ts                  # Monad network configurations (Chain ID 10143)
│   │   ├── crypto.ts                 # SHA-256 and Keccak-256 cryptographic utilities
│   │   ├── mockData.ts               # Sample clinical patients & initial on-chain logs
│   │   └── utils.ts                  # Tailwind clsx / cn formatters & date helpers
│   └── types/                        # Strongly typed schemas (AccessLog, Patient, Web3)
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Monad Testnet Details

- **Network Name**: Monad Testnet
- **Chain ID**: `10143`
- **Currency Symbol**: `MON`
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Block Explorer**: [https://testnet.monadexplorer.com](https://testnet.monadexplorer.com)
- **Target Throughput**: 10,000 TPS
- **Target Block Time**: ~1.0 second

*Note: The application has built-in dual-mode capability: If connected with MetaMask on Monad Testnet, it can execute real on-chain transactions; if disconnected or testing without MON tokens, it uses a high-fidelity local Monad simulator with real cryptographic hashing, block increments, and local persistence.*

---

## 🛡️ Core User Journeys

1. **Healthcare Provider (`/doctor`)**:
   - Select patient record.
   - Off-chain SHA-256 hash is computed in real-time.
   - Enter mandatory clinical justification.
   - Commit access proof to Monad with sub-second confirmation.

2. **Patient (`/patient`)**:
   - Inspect full chronological access history for their records.
   - Identify unauthorized or emergency bypass accesses.
   - Grant or revoke consent to specific physicians on-chain.

3. **Auditor / Compliance (`/audit`)**:
   - Search across all access logs by patient ID, doctor, department, or transaction hash.
   - Inspect on-chain Monad proofs and block details.

4. **Cryptographic Verifier (`/verify`)**:
   - Drag and drop any clinical report PDF or paste an off-chain record hash.
   - Instantly verify whether the document is authentic and how many times it has been accessed.
