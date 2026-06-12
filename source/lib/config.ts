import envPaths from 'env-paths';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

/** Absolute path to the JSON registry that is the source of truth. */
export const registryPath = join(paths.config, 'domains.json');

const emptyRegistry: Registry = { domains: [] };

/** Load the registry, returning an empty one if it does not exist yet. */
export function loadRegistry(): Registry {
  if (!existsSync(registryPath)) {
    return { domains: [] };
  }

  try {
    const raw = readFileSync(registryPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<Registry>;
    return { domains: Array.isArray(parsed.domains) ? parsed.domains : [] };
  } catch {
    return { ...emptyRegistry };
  }
}

/** Persist the registry, creating the config directory if needed. */
export function saveRegistry(registry: Registry): void {
  mkdirSync(dirname(registryPath), { recursive: true });
  writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
}
