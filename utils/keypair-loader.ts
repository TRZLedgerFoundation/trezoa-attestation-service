import * as fs from 'fs';
import * as path from 'path';
import { createKeyPairSignerFromPrivateKeyBytes } from '@trezoa/signers';
import bs58 from 'bs58';

export interface KeyPairConfig {
  payerKeypairFile?: string;
  authorityKeypairFile?: string;
  recipientKeypairFile?: string;
  operatorKeypairFile?: string;
  payerKeypair?: string;
  authorityKeypair?: string;
  recipientKeypair?: string;
  operatorKeypair?: string;
}

/**
 * Load a keypair from a JSON file containing [private_key_bytes_array]
 */
export function loadKeypairFromFile(filePath: string): Uint8Array {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Keypair file not found: ${filePath}`);
  }
  
  const keypairData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(keypairData) || keypairData.length !== 64) {
    throw new Error(`Invalid keypair format in file: ${filePath}`);
  }
  
  return new Uint8Array(keypairData);
}

/**
 * Load a keypair signer from file path or environment variable
 */
export async function loadKeypairSigner(filePathOrBase58: string) {
  // If it looks like a file path
  if (filePathOrBase58.includes('/') || filePathOrBase58.includes('\\')) {
    const privateKeyBytes = loadKeypairFromFile(filePathOrBase58);
    return await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes);
  } else {
    // Assume it's a base58 encoded private key
    const privateKeyBytes = bs58.decode(filePathOrBase58);
    return await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes);
  }
}

/**
 * Load all required keypairs from environment variables
 */
export async function loadKeypairsFromEnv() {
  const config: KeyPairConfig = {
    payerKeypair: process.env.PAYER_KEYPAIR,
    authorityKeypair: process.env.AUTHORITY_KEYPAIR,
    recipientKeypair: process.env.RECIPIENT_KEYPAIR,
    operatorKeypair: process.env.OPERATOR_KEYPAIR,
    payerKeypairFile: process.env.PAYER_KEYPAIR_FILE,
    authorityKeypairFile: process.env.AUTHORITY_KEYPAIR_FILE,
    recipientKeypairFile: process.env.RECIPIENT_KEYPAIR_FILE,
    operatorKeypairFile: process.env.OPERATOR_KEYPAIR_FILE,
  };

  const signers: any = {};

  // Load payer
  if (config.payerKeypair) {
    signers.payer = await loadKeypairSigner(config.payerKeypair);
  } else if (config.payerKeypairFile) {
    signers.payer = await loadKeypairSigner(config.payerKeypairFile);
  } else {
    throw new Error('PAYER_KEYPAIR or PAYER_KEYPAIR_FILE must be set');
  }

  // Load authority
  if (config.authorityKeypair) {
    signers.authority = await loadKeypairSigner(config.authorityKeypair);
  } else if (config.authorityKeypairFile) {
    signers.authority = await loadKeypairSigner(config.authorityKeypairFile);
  } else {
    throw new Error('AUTHORITY_KEYPAIR or AUTHORITY_KEYPAIR_FILE must be set');
  }

  // Load recipient (optional)
  if (config.recipientKeypair) {
    signers.recipient = await loadKeypairSigner(config.recipientKeypair);
  } else if (config.recipientKeypairFile) {
    signers.recipient = await loadKeypairSigner(config.recipientKeypairFile);
  }

  // Load operator (optional)
  if (config.operatorKeypair) {
    signers.operator = await loadKeypairSigner(config.operatorKeypair);
  } else if (config.operatorKeypairFile) {
    signers.operator = await loadKeypairSigner(config.operatorKeypairFile);
  }

  return signers;
}

/**
 * Load keypairs from common TREZOA_KEYS paths
 */
export async function loadKeypairsFromTrezoaKeys(basePath: string = '/Volumes/TREZOA_KEYS') {
  const commonPaths = {
    payer: path.join(basePath, 'payer-keypair.json'),
    authority: path.join(basePath, 'authority-keypair.json'),
    recipient: path.join(basePath, 'recipient-keypair.json'),
    operator: path.join(basePath, 'operator-keypair.json'),
  };

  const signers: any = {};

  for (const [role, filePath] of Object.entries(commonPaths)) {
    if (fs.existsSync(filePath)) {
      try {
        signers[role] = await loadKeypairSigner(filePath);
        console.log(`✓ Loaded ${role} keypair from ${filePath}`);
      } catch (error) {
        console.warn(`⚠ Failed to load ${role} keypair from ${filePath}:`, error);
      }
    } else {
      console.log(`⚠ Keypair file not found: ${filePath}`);
    }
  }

  return signers;
}
