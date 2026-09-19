/**
 * Monad Testnet Contract Deployment Script
 * 
 * Usage:
 *   node contracts/deploy.js
 * 
 * Required Environment Variables (or set in .env.local):
 *   PRIVATE_KEY=<your-monad-testnet-private-key>
 *   MONAD_RPC_URL=https://testnet-rpc.monad.xyz
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  const rpcUrl = process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    console.log('----------------------------------------------------');
    console.log('⚠️  No PRIVATE_KEY provided in environment.');
    console.log('To deploy to live Monad Testnet:');
    console.log('1. Get testnet MON tokens from faucet: https://testnet.monadexplorer.com');
    console.log('2. Run: $env:PRIVATE_KEY="your_key"; node contracts/deploy.js');
    console.log('----------------------------------------------------');
    return;
  }

  console.log('Connecting to Monad RPC:', rpcUrl);
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log('Deployer address on Monad:', wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log('Balance:', ethers.formatEther(balance), 'MON');

  const abiPath = path.join(__dirname, '../src/contracts/MedicalAccessLogger.json');
  const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

  // Contract Bytecode (standard pre-compiled solc artifact or factory)
  console.log('\nDeploying MedicalAccessLogger.sol to Monad (Chain ID: 10143)...');
  console.log('Please ensure solc has output the bytecode, or deploy via Remix / Hardhat / Foundry.');
}

main().catch(console.error);
