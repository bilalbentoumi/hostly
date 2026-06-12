import envPaths from 'env-paths';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export type Domain = {
  host: string;
  port: number;
  https: boolean;
  createdAt: string;
};

export type Registry = {
  domains: Domain[];
};

const paths = envPaths('local-edge', { suffix: '' });

export const registryPath = join(paths.config, 'domains.json');

const emptyRegistry: Registry = { domains: [] };

export function loadRegistry(): Registry {
  try {
    const raw = readFileSync(registryPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<Registry>;
    return { domains: Array.isArray(parsed.domains) ? parsed.domains : [] };
  } catch {
    return emptyRegistry;
  }
}

export function saveRegistry(registry: Registry): void {
  mkdirSync(dirname(registryPath), { recursive: true });
  writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
}
