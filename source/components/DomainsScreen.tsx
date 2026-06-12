import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useCallback, useEffect, useState } from 'react';

import type { DomainStatus, SyncResult } from '../lib/domains.js';
import * as domains from '../lib/domains.js';
import AddDomainForm from './AddDomainForm.js';
import { Header } from './header.js';
import StatusLine from './StatusLine.js';
import { useExclusive } from './useExclusive.js';

type Props = {
  readonly onBack: () => void;
};

type Mode = 'list' | 'add' | 'remove';

type ListItem = { label: string; value: string };

const ADD = '__add__';

function syncNote(result: SyncResult, action: string): string {
  const parts = [action];
  if (result.elevated) {
    parts.push('(updated /etc/hosts via sudo)');
  }

  if (result.caddyError) {
    parts.push(`— Caddy not updated: ${result.caddyError}`);
  }

  return parts.join(' ');
}

export default function DomainsScreen({ onBack }: Props) {
  const runExclusive = useExclusive();

  const [mode, setMode] = useState<Mode>('list');
  const [rows, setRows] = useState<DomainStatus[]>([]);
  const [target, setTarget] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string>();
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();

  const refresh = useCallback(async () => {
    setRows(await domains.list());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useInput(
    (input, key) => {
      if (key.escape) {
        onBack();
        return;
      }

      if (input === 'r') {
        void refresh();
      }
    },
    { isActive: mode === 'list' && !busy },
  );

  useInput(
    (input, key) => {
      if (key.escape || input === 'n') {
        setMode('list');
        return;
      }

      if (input === 'y' && target) {
        void doRemove(target);
      }
    },
    { isActive: mode === 'remove' && !busy },
  );

  const handleSelect = (item: ListItem) => {
    setError(undefined);
    setInfo(undefined);
    if (item.value === ADD) {
      setMode('add');
      return;
    }

    setTarget(item.value);
    setMode('remove');
  };

  const doAdd = async (host: string, port: number) => {
    setMode('list');
    setBusy(true);
    setBusyLabel(`Adding ${host}…`);
    setError(undefined);
    setInfo(undefined);
    try {
      const result = await runExclusive(async () => domains.add(host, port));
      setInfo(syncNote(result, `Added ${host} → 127.0.0.1:${port}`));
    } catch (error_) {
      setError((error_ as Error).message);
    } finally {
      setBusy(false);
      setBusyLabel(undefined);
      await refresh();
    }
  };

  const doRemove = async (host: string) => {
    setMode('list');
    setBusy(true);
    setBusyLabel(`Removing ${host}…`);
    setError(undefined);
    setInfo(undefined);
    try {
      const result = await runExclusive(async () => domains.remove(host));
      setInfo(syncNote(result, `Removed ${host}`));
    } catch (error_) {
      setError((error_ as Error).message);
    } finally {
      setBusy(false);
      setBusyLabel(undefined);
      await refresh();
    }
  };

  if (mode === 'add') {
    return (
      <AddDomainForm
        onSubmit={(host, port) => void doAdd(host, port)}
        onCancel={() => setMode('list')}
      />
    );
  }

  const items: ListItem[] = [
    { label: '＋ Add domain', value: ADD },
    ...rows.map((row) => {
      const glyph = row.synced ? '✓' : '⚠';
      const scheme = row.https ? 'https' : 'http';
      return {
        label: `${glyph} ${scheme}://${row.host}  →  127.0.0.1:${row.port}`,
        value: row.host,
      };
    }),
  ];

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Header
          subContent={
            <Box>
              <Text bold color="cyan">
                Domains
              </Text>
              <Text bold color="gray">
                {' '}
                — {rows.length} registered
              </Text>
            </Box>
          }
        />
      </Box>

      {mode === 'remove' && target ? (
        <Box marginBottom={1}>
          <Text color="yellow">Remove {target}? </Text>
          <Text dimColor>(y/N)</Text>
        </Box>
      ) : (
        <SelectInput items={items} isFocused={!busy} onSelect={handleSelect} />
      )}

      <Box marginTop={1}>
        <StatusLine
          busy={busy}
          busyLabel={busyLabel}
          error={error}
          info={info}
        />
      </Box>
      {!busy && mode === 'list' ? (
        <Box marginTop={1}>
          <Text dimColor>
            ↵ select to remove | r refresh | esc back | ✓ synced ⚠ drift
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}
