import { getFirestore } from "@common/config/firebase.js";
import { Wallet } from "xrpl";

function getMnemonic(): string {
  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) {
    throw new Error("MNEMONIC is not configured");
  }
  return mnemonic;
}

function derivationPath(index: number): string {
  return `m/44'/144'/0'/0/${index}`;
}

async function deriveFullWallet(index: number): Promise<Wallet> {
  const mnemonic = await getMnemonic();
  return Wallet.fromMnemonic(mnemonic, { derivationPath: derivationPath(index) });
}

export async function deriveWallet(index: number): Promise<{ address: string; publicKey: string }> {
  const wallet = await deriveFullWallet(index);
  return { address: wallet.address, publicKey: wallet.publicKey };
}

export async function getWalletForSigning(index: number): Promise<Wallet> {
  return deriveFullWallet(index);
}

export async function allocateXrpAddressIndex(): Promise<number> {
  const db = getFirestore();
  const counterRef = db.collection("token_counters").doc("bipIndex");

  return db.runTransaction(async (tx) => {
    const counterDoc = await tx.get(counterRef);
    const current = counterDoc.exists ? (counterDoc.data()?.value as number) : 0;
    const next = current + 1;
    tx.set(counterRef, { value: next });
    return next;
  });
}
