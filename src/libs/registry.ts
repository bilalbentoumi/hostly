import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import envPaths from 'env-paths';

import type { Domain, DomainScheme, Registry } from '../types/index.js';

const paths = envPaths('local-edge', { suffix: '' });

export const registryPath = join(paths.config, 'domains.json');

function normalizeDomain(raw: Record<string, unknown>): Domain {
  const rawScheme = raw['scheme'];
  const scheme: DomainScheme =
    rawScheme === 'http' || rawScheme === 'https' || rawScheme === 'both'
      ? rawScheme
      : raw['https'] === false
        ? 'http'
        : 'https';

  return {
    host: String(raw['host']),
    port: Number(raw['port']),
    scheme,
    createdAt: String(raw['createdAt'] ?? ''),
  };
}

export function loadRegistry(): Registry {
  try {
    const raw = readFileSync(registryPath, 'utf8');
    const parsed = JSON.parse(raw) as { domains?: unknown };
    const domains = Array.isArray(parsed.domains) ? parsed.domains : [];
    return { domains: domains.map((d) => normalizeDomain(d)) };
  } catch {
    return { domains: [] };
  }
}

export function saveRegistry(registry: Registry): void {
  mkdirSync(dirname(registryPath), { recursive: true });
  writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
}

export function updateRegistry(fn: (registry: Registry) => void): Registry {
  const registry = loadRegistry();
  fn(registry);
  saveRegistry(registry);
  return registry;
}
