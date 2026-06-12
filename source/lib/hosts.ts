import { execa } from 'execa';
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { Domain } from './config.js';

const HOSTS_PATH = '/etc/hosts';
const START = '# >>> local-edge >>>';
const END = '# <<< local-edge <<<';
const LOOPBACK = '127.0.0.1';

function readFile(): string {
  try {
    return readFileSync(HOSTS_PATH, 'utf8');
  } catch {
    return '';
  }
}

/** Strip the local-edge managed block (and its surrounding blank lines). */
function stripBlock(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inside = false;
  for (const line of lines) {
    if (line.trim() === START) {
      inside = true;
      continue;
    }

    if (line.trim() === END) {
      inside = false;
      continue;
    }

    if (!inside) {
      result.push(line);
    }
  }

  return result
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n+$/, '\n');
}

/** Build the full /etc/hosts content with our block reflecting `domains`. */
function buildContent(current: string, domains: Domain[]): string {
  let base = stripBlock(current);
  if (!base.endsWith('\n')) {
    base += '\n';
  }

  if (domains.length === 0) {
    return base;
  }

  const block = [
    START,
    ...domains.map((d) => `${LOOPBACK} ${d.host}`),
    END,
    '',
  ].join('\n');

  return `${base}\n${block}`;
}

/** Hosts currently present in our managed block. */
export function readManagedHosts(): string[] {
  const lines = readFile().split('\n');
  const hosts: string[] = [];
  let inside = false;
  for (const line of lines) {
    if (line.trim() === START) {
      inside = true;
      continue;
    }

    if (line.trim() === END) {
      break;
    }

    if (inside) {
      const host = line.trim().split(/\s+/)[1];
      if (host) {
        hosts.push(host);
      }
    }
  }

  return hosts;
}

/**
 * Rewrite /etc/hosts so the managed block matches `domains`. Falls back to a
 * `sudo cp` (with an interactive password prompt) when the file is not
 * directly writable. Returns whether elevation was required.
 */
export async function write(domains: Domain[]): Promise<{ elevated: boolean }> {
  const current = readFile();
  const next = buildContent(current, domains);
  if (next === current) {
    return { elevated: false };
  }

  try {
    writeFileSync(HOSTS_PATH, next, 'utf8');
    return { elevated: false };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EACCES') {
      throw error;
    }
  }

  const temp = join(tmpdir(), 'local-edge-hosts');
  writeFileSync(temp, next, 'utf8');
  await execa('sudo', ['cp', temp, HOSTS_PATH], { stdio: 'inherit' });
  return { elevated: true };
}
