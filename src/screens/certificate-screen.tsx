import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useCallback, useEffect, useState } from 'react';

import { Header } from '../components/header.js';
import { KeyHints } from '../components/key-hints.js';
import { StatusLine } from '../components/status-line.js';
import { useExclusive } from '../hooks/use-exclusive.js';
import * as caddy from '../libs/caddy.js';
import { useAppStore } from '../stores/app-store.js';
import type { CertAction, CertStatus, ListItem } from '../types/index.js';

const items: ListItem[] = [
  { label: 'Trust local CA (install root certificate)', value: 'trust' },
  { label: 'Untrust local CA (remove root certificate)', value: 'untrust' },
];

export function CertificateScreen() {
  const { setScreen } = useAppStore();
  const runExclusive = useExclusive();

  const [status, setStatus] = useState<CertStatus>();
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string>();
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();

  const refresh = useCallback(async () => {
    try {
      setStatus(await caddy.certStatus());
    } catch (error_) {
      setError((error_ as Error).message);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useInput(
    (_input, key) => {
      if (key.escape) {
        setScreen('menu');
      }
    },
    { isActive: !busy },
  );

  const run = async (action: CertAction) => {
    setBusy(true);
    setError(undefined);
    setInfo(undefined);
    try {
      if (action === 'trust') {
        setBusyLabel('Installing local CA into trust store…');
        await runExclusive(async () => caddy.trust());
        setInfo('Local CA installed into the system trust store');
      } else {
        setBusyLabel('Removing local CA from trust store…');
        await runExclusive(async () => caddy.untrust());
        setInfo('Local CA removed from the system trust store');
      }
    } catch (error_) {
      setError((error_ as Error).message);
    } finally {
      setBusy(false);
      setBusyLabel(undefined);
      await refresh();
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Header
          subContent={
            <Text bold color="cyan">
              Certificate
            </Text>
          }
        />
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Box>
          <Text>Local CA: </Text>
          {status === undefined ? (
            <Text dimColor>checking…</Text>
          ) : status.ca ? (
            <Text color="green">
              {status.ca.root_common_name ?? status.ca.name}
            </Text>
          ) : status.reachable ? (
            <Text color="yellow">not generated yet</Text>
          ) : (
            <Text color="red">Caddy unreachable</Text>
          )}
        </Box>
        <Text dimColor>
          {' '}
          Trusting installs Caddy&apos;s root cert so browsers accept your HTTPS
          domains.
        </Text>
        <Text dimColor>
          {' '}
          Trust state isn&apos;t detected — re-running either action is safe.
        </Text>
      </Box>

      <SelectInput
        items={items}
        isFocused={!busy}
        onSelect={(item) => void run(item.value as CertAction)}
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
          <KeyHints
            hints={[
              { key: '↵', label: 'select' },
              { key: 'esc', label: 'back' },
            ]}
          />
        </Box>
      ) : null}
    </Box>
  );
}
