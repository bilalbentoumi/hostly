import { execa } from 'execa';

import type { AnyConfig, CaInfo, Domain, Route } from '../types/index.js';

export const CADDY_API_BASE_URL = 'http://localhost:2019';

export const SERVER_ID = 'le-server';

export const CA_ID = 'local';

const LISTEN = [':443', ':80'];

function routeId(host: string): string {
  return `le-${host}`;
}

async function admin(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${CADDY_API_BASE_URL}${path}`, {
    ...init,
    headers: { Origin: CADDY_API_BASE_URL, ...init?.headers },
  });
}

export async function ping(): Promise<boolean> {
  try {
    const res = await admin('/config/');
    return res.ok;
  } catch {
    return false;
  }
}

export async function start(): Promise<void> {
  await execa('caddy', ['start']);
}

export async function stop(): Promise<void> {
  await execa('caddy', ['stop']);
}

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

export async function apply(domains: Domain[]): Promise<void> {
  const config: AnyConfig = await getConfig();

  config['apps'] ??= {};
  const apps = config['apps'] as AnyConfig;

  apps['http'] ??= {};
  const http = apps['http'] as AnyConfig;
  http['servers'] ??= {};
  const servers = http['servers'] as AnyConfig;

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
