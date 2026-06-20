import type {
  Domain,
  DomainScheme,
  DomainStatus,
  SyncResult,
} from '../types/index.js';
import * as caddy from './caddy.js';
import * as dnsmasq from './dnsmasq.js';
import * as hosts from './hosts.js';
import * as config from './registry.js';

const HOST_PATTERN =
  /^(\*\.)?[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

export function isWildcard(host: string): boolean {
  return host.startsWith('*.');
}

export function wildcardBase(host: string): string {
  return host.slice(2);
}

export function validate(
  host: string,
  port: number,
  existing: Domain[],
): string | undefined {
  if (!HOST_PATTERN.test(host)) {
    return 'Host must be a dotted name like myapp.local or *.myapp.local';
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return 'Port must be an integer between 1 and 65535';
  }

  if (existing.some((d) => d.host === host)) {
    return `${host} is already registered`;
  }

  return undefined;
}

export async function add({
  host,
  port,
  scheme = 'https',
}: {
  host: string;
  port: number;
  scheme?: DomainScheme;
}): Promise<SyncResult> {
  const { domains } = config.updateRegistry((registry) => {
    const error = validate(host, port, registry.domains);
    if (error) {
      throw new Error(error);
    }

    registry.domains.push({
      host,
      port,
      scheme,
      createdAt: new Date().toISOString(),
    });
  });

  return reconcile(domains);
}

export async function update({
  originalHost,
  host,
  port,
  scheme = 'https',
}: {
  originalHost: string;
  host: string;
  port: number;
  scheme: DomainScheme;
}): Promise<SyncResult> {
  const { domains } = config.updateRegistry((registry) => {
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
      scheme,
    };
  });

  return reconcile(domains);
}

export async function remove(host: string): Promise<SyncResult> {
  const { domains } = config.updateRegistry((registry) => {
    registry.domains = registry.domains.filter((d) => d.host !== host);
  });
  return reconcile(domains);
}

export async function syncAll(): Promise<SyncResult> {
  return reconcile(config.loadRegistry().domains);
}

export async function applyToCaddy(): Promise<void> {
  await caddy.apply(config.loadRegistry().domains);
}

export async function list(): Promise<DomainStatus[]> {
  const { domains } = config.loadRegistry();
  const managed = new Set(hosts.readManagedHosts());
  const dnsBases = new Set(dnsmasq.managedBases());
  const routes = await caddy.listRoutes();
  const routed = new Set(
    routes.flatMap((r) => r.match?.flatMap((m) => m.host ?? []) ?? []),
  );

  return domains.map((domain) => {
    const inHosts = isWildcard(domain.host)
      ? dnsBases.has(wildcardBase(domain.host))
      : managed.has(domain.host);
    const inCaddy = routed.has(domain.host);
    return { ...domain, inHosts, inCaddy, synced: inHosts && inCaddy };
  });
}

async function reconcile(domains: Domain[]): Promise<SyncResult> {
  const { elevated: hostsElevated } = await hosts.write(domains);

  const bases = domains
    .filter((d) => isWildcard(d.host))
    .map((d) => wildcardBase(d.host));
  let dnsError: string | undefined;
  let dnsElevated = false;
  try {
    ({ elevated: dnsElevated } = await dnsmasq.sync(bases));
  } catch (error) {
    dnsError = (error as Error).message;
  }

  let caddyError: string | undefined;
  try {
    await caddy.apply(domains);
  } catch (error) {
    caddyError = (error as Error).message;
  }

  return { elevated: hostsElevated || dnsElevated, caddyError, dnsError };
}
