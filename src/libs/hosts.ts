import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execa } from 'execa';

import type { Domain } from '../types/index.js';

const HOSTS_PATH = '/etc/hosts';
const START = '# Hostly Start';
const END = '# Hostly End';
const LOOPBACK = '127.0.0.1';

function readFile(): string {
  try {
    return readFileSync(HOSTS_PATH, 'utf8');
  } catch {
    return '';
  }
}

function splitManagedBlock(content: string): {
  outside: string[];
  managed: string[];
} {
  const outside: string[] = [];
  const managed: string[] = [];
  let inside = false;

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed === START) {
      inside = true;
    } else if (trimmed === END) {
      inside = false;
    } else if (inside) {
      managed.push(line);
    } else {
      outside.push(line);
    }
  }

  return { outside, managed };
}

function stripBlock(content: string): string {
  return splitManagedBlock(content)
    .outside.join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n+$/, '\n');
}

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
    ...domains.map((d) => `${LOOPBACK}\t${d.host}`),
    END,
    '',
  ].join('\n');

  return `${base}\n${block}`;
}

export function readManagedHosts(): string[] {
  return splitManagedBlock(readFile())
    .managed.map((line) => line.trim().split(/\s+/)[1])
    .filter((host): host is string => Boolean(host));
}

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

  const temp = join(mkdtempSync(join(tmpdir(), 'hostly-')), 'hosts');
  writeFileSync(temp, next, 'utf8');
  await execa('sudo', ['cp', temp, HOSTS_PATH], { stdio: 'inherit' });
  return { elevated: true };
}
