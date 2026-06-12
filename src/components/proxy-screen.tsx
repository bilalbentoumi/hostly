import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useCallback, useEffect, useState } from 'react';

import { useExclusive } from '../hooks/use-exclusive.js';
import type { Route } from '../lib/caddy.js';
import * as caddy from '../lib/caddy.js';
import * as domains from '../lib/domains.js';
import StatusLine from './status-line.js';

type Props = {
  readonly onBack: () => void;
};

type Action = 'start' | 'stop' | 'sync';

function routeHost(route: Route): string {
  return route.match?.[0]?.host?.[0] ?? '(unknown)';
}

function routeUpstream(route: Route): string {
  return route.handle?.[0]?.upstreams?.[0]?.dial ?? '?';
}

/** Caddy status, lifecycle controls, and the live route list. */
export default function ProxyScreen({ onBack }: Props) {
  const runExclusive = useExclusive();
  const [reachable, setReachable] = useState<boolean>();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string>();
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();

  const refresh = useCallback(async () => {
    const up = await caddy.ping();
    setReachable(up);
    setRoutes(up ? await caddy.listRoutes() : []);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useInput(
    (_input, key) => {
      if (key.escape) {
        onBack();
      }
    },
    { isActive: !busy },
  );

  const run = async (action: Action) => {
    setBusy(true);
    setError(undefined);
    setInfo(undefined);
    try {
      if (action === 'start') {
        setBusyLabel('Starting Caddy…');
        await runExclusive(async () => caddy.start());
        setInfo('Caddy started');
      } else if (action === 'stop') {
        setBusyLabel('Stopping Caddy…');
        await runExclusive(async () => caddy.stop());
        setInfo('Caddy stopped');
      } else {
        setBusyLabel('Syncing routes…');
        const result = await runExclusive(async () => domains.syncAll());
        setInfo(
          result.caddyError
            ? `Sync failed: ${result.caddyError}`
            : 'Routes synced from registry',
        );
      }
    } catch (error_) {
      setError((error_ as Error).message);
    } finally {
      setBusy(false);
      setBusyLabel(undefined);
      await refresh();
    }
  };

  const items = reachable
    ? [
        { label: '🔄  Sync routes from registry', value: 'sync' as const },
        { label: '⏹   Stop Caddy', value: 'stop' as const },
      ]
    : [{ label: '▶   Start Caddy', value: 'start' as const }];

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Proxy & Caddy
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text>Admin API ({caddy.ADMIN}): </Text>
        {reachable === undefined ? (
          <Text dimColor>checking…</Text>
        ) : reachable ? (
          <Text color="green">reachable</Text>
        ) : (
          <Text color="red">unreachable</Text>
        )}
      </Box>

      {reachable ? (
        <Box flexDirection="column" marginBottom={1}>
          <Text dimColor>Routes ({routes.length}):</Text>
          {routes.length === 0 ? (
            <Text dimColor> none</Text>
          ) : (
            routes.map((route) => (
              <Text key={routeHost(route)}>
                {'  '}
                {routeHost(route)} → {routeUpstream(route)}
              </Text>
            ))
          )}
        </Box>
      ) : null}

      <SelectInput
        items={items}
        isFocused={!busy}
        onSelect={(item) => void run(item.value)}
      />

      <Box marginTop={1}>
        <StatusLine
          busy={busy}
          busyLabel={busyLabel}
          error={error}
          info={info}
        />
      </Box>
      {!busy ? (
        <Box marginTop={1}>
          <Text dimColor>↵ select · esc back</Text>
        </Box>
      ) : null}
    </Box>
  );
}
