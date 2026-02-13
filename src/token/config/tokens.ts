import { convertHexToString, convertStringToHex } from "xrpl";

export interface TokenConfig {
  tokenId: string;
  name: string;
  currency: string;
  domain: string;
  issuerAddress: string;
  kmsKeyPath: string;
  signingPublicKey: string;
}

const TOKEN_CONFIGS: Record<string, TokenConfig> = {
  JPYN: {
    tokenId: "JPYN",
    name: "JPYN",
    currency: "JPYN",
    domain: process.env.ISSUER_DOMAIN ?? "example.com",
    issuerAddress: process.env.JPYN_ISSUER_ADDRESS ?? "",
    kmsKeyPath: process.env.JPYN_KMS_KEY_PATH ?? "",
    signingPublicKey: process.env.JPYN_SIGNING_PUBLIC_KEY ?? "",
  },
};

export function getTokenConfig(tokenId: string): TokenConfig {
  const config = TOKEN_CONFIGS[tokenId];
  if (!config) {
    throw new Error(`Unknown token: ${tokenId}`);
  }
  return config;
}

export function getAllTokenConfigs(): TokenConfig[] {
  return Object.values(TOKEN_CONFIGS);
}

export function toXrplCurrency(code: string): string {
  if (code.length === 3) return code;
  if (code.length > 3) return convertStringToHex(code).padEnd(40, "0");
  throw new Error(`Invalid currency code: "${code}" (must be >= 3 characters)`);
}

export function fromXrplCurrency(hex: string): string {
  if (hex.length === 3) return hex;
  if (hex.length === 40) return convertHexToString(hex).replace(/\0/g, "");
  return hex;
}
