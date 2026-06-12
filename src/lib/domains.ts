import * as caddy from './caddy.js';
import { loadRegistry, saveRegistry, type Domain } from './config.js';
import * as hosts from './hosts.js';

export type DomainStatus = Domain & {
  inHosts: boolean;
  inCaddy: boolean;
  synced: boolean;
};

export type SyncResult = {
  elevated: boolean;
  caddyError?: string;
};

const HOST_PATTERN =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

export function validate(
  host: string,
  port: number,
  existing: Domain[],
): string | undefined {
  if (!HOST_PATTERN.test(host)) {
    return 'Host must be a dotted name like myapp.local';
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return 'Port must be an integer between 1 and 65535';
  }

  if (existing.some((d) => d.host === host)) {
    return `${host} is already registered`;
  }

  return undefined;
}

async function reconcile(domains: Domain[]): Promise<SyncResult> {
  const { elevated } = await hosts.write(domains);
  let caddyError: string | undefined;
  try {
    await caddy.apply(domains);
  } catch (error) {
    caddyError = (error as Error).message;
  }

  return { elevated, caddyError };
}

export async function add(
  host: string,
  port: number,
  https = true,
): Promise<SyncResult> {
  const registry = loadRegistry();
  const error = validate(host, port, registry.domains);
  if (error) {
    throw new Error(error);
  }

  registry.domains.push({
    host,
    port,
    https,
    createdAt: new Date().toISOString(),
  });

  saveRegistry(registry);

  const { elevated } = await hosts.write(registry.domains);

  return { elevated };
}

export async function update(
  originalHost: string,
  host: string,
  port: number,
  https = true,
): Promise<SyncResult> {
  const registry = loadRegistry();
  const index = registry.domains.findIndex((d) => d.host === originalHost);
  if (index === -1) {
    throw new Error(`${originalHost} is not registered`);
  }

  const existing = registry.domains[index]!;
  const others = registry.domains.filter((_, i) => i !== index);
  const error = validate(host, port, others);
  if (error) {
    throw new Error(error);
  }

  registry.domains[index] = {
    ...existing,
    host,
    port,
    https,
  };

  saveRegistry(registry);

  return reconcile(registry.domains);
}

export async function remove(host: string): Promise<SyncResult> {
  const registry = loadRegistry();
  registry.domains = registry.domains.filter((d) => d.host !== host);
  saveRegistry(registry);
  return reconcile(registry.domains);
}

export async function syncAll(): Promise<SyncResult> {
  return reconcile(loadRegistry().domains);
}

export async function list(): Promise<DomainStatus[]> {
  const { domains } = loadRegistry();
  const managed = new Set(hosts.readManagedHosts());
  const routes = await caddy.listRoutes();
  const routed = new Set(
    routes.flatMap((r) => r.match?.flatMap((m) => m.host ?? []) ?? []),
  );

  return domains.map((domain) => {
    const inHosts = managed.has(domain.host);
    const inCaddy = routed.has(domain.host);
    return { ...domain, inHosts, inCaddy, synced: inHosts && inCaddy };
  });
}
