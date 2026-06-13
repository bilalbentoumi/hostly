import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useCallback, useEffect, useState } from 'react';

import { Header } from '../components/header.js';
import { KeyHints } from '../components/key-hints.js';
import { StatusLine } from '../components/status-line.js';
import { useExclusive } from '../hooks/use-exclusive.js';
import type { DaemonStatus } from '../libs/daemon.js';
import * as daemon from '../libs/daemon.js';
import { useAppStore } from '../stores/app-store.js';
import type { DaemonAction } from '../types/index.js';

export function DaemonScreen() {
  const { setScreen } = useAppStore();
  const runExclusive = useExclusive();

  const [status, setStatus] = useState<DaemonStatus>();
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string>();
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();

  const refresh = useCallback(async () => {
    try {
      setStatus(await daemon.daemonStatus());
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

  const run = async (action: DaemonAction) => {
    setBusy(true);
    setError(undefined);
    setInfo(undefined);
    try {
      if (action === 'install') {
        setBusyLabel('Installing daemon…');
        const result = await runExclusive(async () => daemon.installDaemon());
        setInfo(`Daemon installed (${result.path})`);
      } else {
        setBusyLabel('Removing daemon…');
        const result = await runExclusive(async () => daemon.uninstallDaemon());
        setInfo(`Daemon removed (${result.path})`);
      }
    } catch (error_) {
      setError((error_ as Error).message);
    } finally {
      setBusy(false);
      setBusyLabel(undefined);
      await refresh();
    }
  };

  const items = status?.installed
    ? [{ label: 'Remove boot daemon', value: 'uninstall' as const }]
    : [{ label: 'Install boot daemon', value: 'install' as const }];

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Header
          subContent={
            <Text bold color="cyan">
              Daemon
            </Text>
          }
        />
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Box>
          <Text>Status: </Text>
          {status === undefined ? (
            <Text dimColor>checking…</Text>
          ) : status.installed ? (
            <Text color="green">
              installed{status.loaded ? ' & loaded' : ' (not loaded)'}
            </Text>
          ) : (
            <Text color="yellow">not installed</Text>
          )}
        </Box>
        {status ? <Text dimColor> {status.path}</Text> : null}
      </Box>

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
