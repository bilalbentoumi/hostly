import { execa } from 'execa';

import type { Domain } from './config.js';

/** Caddy's local admin API. */
export const ADMIN = 'http://localhost:2019';

/** Name of the dedicated HTTP server local-edge owns inside Caddy's config. */
export const SERVER_ID = 'le-server';

/** Caddy's internal CA id used for non-public (.local) certificates. */
export const CA_ID = 'local';

/** Listener addresses our managed server claims. */
const LISTEN = [':443', ':80'];

export type CaInfo = {
  id: string;
  name: string;
  root_common_name?: string;
  root_certificate?: string;
};

export type Route = {
  '@id'?: string;
  match?: Array<{ host?: string[] }>;
  handle?: Array<{ handler: string; upstreams?: Array<{ dial: string }> }>;
  terminal?: boolean;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyConfig = Record<string, any>;

function routeId(host: string): string {
  return `le-${host}`;
}

async function admin(path: string, init?: RequestInit): Promise<Response> {
  // Caddy's admin API rejects requests whose Origin isn't allowed. Node's
  // fetch sends an empty Origin header, which Caddy refuses with a 403, so we
  // pin it to the admin endpoint itself.
  return fetch(`${ADMIN}${path}`, {
    ...init,
    headers: { Origin: ADMIN, ...init?.headers },
  });
}

/** Returns true when Caddy's admin API is reachable. */
export async function ping(): Promise<boolean> {
  try {
    const res = await admin('/config/');
    return res.ok;
  } catch {
    return false;
  }
}

/** Start Caddy in the background (it exposes the admin API on :2019). */
export async function start(): Promise<void> {
  await execa('caddy', ['start']);
}

/** Stop the running Caddy process. */
export async function stop(): Promise<void> {
  await execa('caddy', ['stop']);
}

/** Fetch the full active config, or an empty object if none is loaded. */
async function getConfig(): Promise<AnyConfig> {
  const res = await admin('/config/');
  if (!res.ok) {
    throw new Error(`Caddy returned ${res.status} reading config`);
  }

  const body = (await res.json()) as AnyConfig | null;
  return body ?? {};
}

function buildRoute(domain: Domain): Route {
  return {
    '@id': routeId(domain.host),
    match: [{ host: [domain.host] }],
    handle: [
      {
        handler: 'reverse_proxy',
        upstreams: [{ dial: `127.0.0.1:${domain.port}` }],
      },
    ],
    terminal: true,
  };
}

/**
 * Reconcile Caddy with the given domains: ensure the dedicated `local-edge`
 * server, its routes, and an internal-CA TLS policy scoped to our hosts —
 * without disturbing any other server or policy the user has configured.
 */
export async function apply(domains: Domain[]): Promise<void> {
  const config: AnyConfig = await getConfig();

  config['apps'] ??= {};
  const apps = config['apps'] as AnyConfig;

  // HTTP server with our routes.
  apps['http'] ??= {};
  const http = apps['http'] as AnyConfig;
  http['servers'] ??= {};
  const servers = http['servers'] as AnyConfig;

  // Free our listener addresses from any other server, since Caddy refuses to
  // load two servers claiming the same port. Servers left with no listeners
  // are dropped entirely.
  for (const [name, server] of Object.entries(servers)) {
    if (name === 'local-edge') continue;
    const srv = server as AnyConfig;
    const listen: string[] = Array.isArray(srv['listen']) ? srv['listen'] : [];
    srv['listen'] = listen.filter((addr) => !LISTEN.includes(addr));
    if ((srv['listen'] as string[]).length === 0) {
      delete servers[name];
    }
  }

  servers['local-edge'] = {
    '@id': SERVER_ID,
    listen: [...LISTEN],
    routes: domains.map(buildRoute),
  };

  // TLS automation policy forcing the internal issuer for our hosts only.
  apps['tls'] ??= {};
  const tls = apps['tls'] as AnyConfig;
  tls['automation'] ??= {};
  const automation = tls['automation'] as AnyConfig;
  const existing: any[] = Array.isArray(automation['policies'])
    ? (automation['policies'] as any[])
    : [];
  const policies = existing.filter((p) => p?.['@id'] !== 'le-tls');
  const hosts = domains.filter((d) => d.https).map((d) => d.host);
  if (hosts.length > 0) {
    policies.push({
      '@id': 'le-tls',
      subjects: hosts,
      issuers: [{ module: 'internal' }],
    });
  }

  automation['policies'] = policies;

  const res = await admin('/load', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Caddy rejected config (${res.status}): ${detail}`);
  }
}

/** Read the routes currently configured on our managed server. */
export async function listRoutes(): Promise<Route[]> {
  try {
    const res = await admin(`/id/${SERVER_ID}`);
    if (!res.ok) {
      return [];
    }

    const server = (await res.json()) as { routes?: Route[] };
    return server.routes ?? [];
  } catch {
    return [];
  }
}

/** Fetch info about Caddy's internal certificate authority. */
export async function getCa(): Promise<CaInfo | undefined> {
  try {
    const res = await admin(`/pki/ca/${CA_ID}`);
    if (!res.ok) {
      return undefined;
    }

    return (await res.json()) as CaInfo;
  } catch {
    return undefined;
  }
}
