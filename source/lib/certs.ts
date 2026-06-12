import { execa } from 'execa';
import { writeFileSync } from 'node:fs';
import { platform } from 'node:process';

import { getCa } from './caddy.js';

export type TrustStatus = 'trusted' | 'untrusted' | 'unsupported' | 'unknown';

export type CertInfo = {
  available: boolean;
  name?: string;
  rootCommonName?: string;
  hasRoot: boolean;
};

/** Summarise Caddy's internal CA. */
export async function info(): Promise<CertInfo> {
  const ca = await getCa();
  if (!ca) {
    return { available: false, hasRoot: false };
  }

  return {
    available: true,
    name: ca.name,
    rootCommonName: ca.root_common_name,
    hasRoot: Boolean(ca.root_certificate),
  };
}

/**
 * Whether the internal CA's root certificate is present in the system trust
 * store. Only implemented for macOS; other platforms report `unsupported`.
 */
export async function trusted(): Promise<TrustStatus> {
  if (platform !== 'darwin') {
    return 'unsupported';
  }

  const ca = await getCa();
  if (!ca?.root_common_name) {
    return 'unknown';
  }

  try {
    await execa('security', [
      'find-certificate',
      '-c',
      ca.root_common_name,
      '/Library/Keychains/System.keychain',
    ]);
    return 'trusted';
  } catch {
    return 'untrusted';
  }
}

/** Write the internal CA's root certificate (PEM) to `path`. */
export async function exportRoot(path: string): Promise<void> {
  const ca = await getCa();
  if (!ca?.root_certificate) {
    throw new Error('Caddy internal CA root certificate is not available');
  }

  writeFileSync(path, ca.root_certificate, 'utf8');
}
