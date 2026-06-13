import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useCallback, useEffect, useState } from 'react';

import { Header } from '../components/header.js';
import { KeyHints } from '../components/key-hints.js';
import { SaveDomainForm } from '../components/save-domain-form.js';
import { StatusLine } from '../components/status-line.js';
import { useExclusive } from '../hooks/use-exclusive.js';
import * as domains from '../libs/domains.js';
import { useAppStore } from '../stores/app-store.js';
import type {
  DomainStatus,
  DomainsMode,
  ListItem,
  SyncResult,
} from '../types/index.js';

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

export function DomainsScreen() {
  const { setScreen } = useAppStore();
  const runExclusive = useExclusive();

  const [mode, setMode] = useState<DomainsMode>('list');
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
        setScreen('menu');
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

  useInput(
    (_input, key) => {
      if (key.escape) {
        setMode('list');
        setTarget(undefined);
      }
    },
    { isActive: mode === 'actions' && !busy },
  );

  const handleSelect = (item: ListItem) => {
    setError(undefined);
    setInfo(undefined);
    if (item.value === 'add') {
      setMode('add');
      return;
    }

    setTarget(item.value);
    setMode('actions');
  };

  const handleAction = (item: ListItem) => {
    if (item.value === 'edit') {
      setMode('edit');
      return;
    }

    if (item.value === 'delete') {
      setMode('remove');
      return;
    }

    setMode('list');
    setTarget(undefined);
  };

  const doAdd = async (host: string, port: number, https: boolean) => {
    setMode('list');
    setBusy(true);
    setBusyLabel(`Adding ${host}…`);
    setError(undefined);
    setInfo(undefined);
    try {
      const result = await runExclusive(async () =>
        domains.add({ host, port, https }),
      );
      setInfo(syncNote(result, `Added ${host} → 127.0.0.1:${port}`));
    } catch (error_) {
      setError((error_ as Error).message);
    } finally {
      setBusy(false);
      setBusyLabel(undefined);
      await refresh();
    }
  };

  const doEdit = async (
    originalHost: string,
    host: string,
    port: number,
    https: boolean,
  ) => {
    setMode('list');
    setTarget(undefined);
    setBusy(true);
    setBusyLabel(`Updating ${originalHost}…`);
    setError(undefined);
    setInfo(undefined);
    try {
      const result = await runExclusive(async () =>
        domains.update({ originalHost, host, port, https }),
      );
      setInfo(syncNote(result, `Updated ${host} → 127.0.0.1:${port}`));
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
      <SaveDomainForm
        onSubmit={(host, port, https) => void doAdd(host, port, https)}
        onCancel={() => setMode('list')}
      />
    );
  }

  const targetRow = rows.find((row) => row.host === target);

  if (mode === 'edit' && targetRow) {
    return (
      <SaveDomainForm
        title="Edit domain"
        initialData={{
          host: targetRow.host,
          port: targetRow.port,
          https: targetRow.https,
        }}
        onSubmit={(host, port, https) =>
          void doEdit(targetRow.host, host, port, https)
        }
        onCancel={() => setMode('list')}
      />
    );
  }

  const actionItems: ListItem[] = [
    { label: '✎ Edit', value: 'edit' },
    { label: '✗ Delete', value: 'delete' },
    { label: '↩ Cancel', value: 'cancel' },
  ];

  const items: ListItem[] = [
    { label: '＋ Add domain', value: 'add' },
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
      ) : mode === 'actions' && target ? (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text color="cyan">{target}</Text>
          </Box>
          <SelectInput
            items={actionItems}
            isFocused={!busy}
            onSelect={handleAction}
          />
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
          <KeyHints
            hints={[
              { key: '↵', label: 'select to edit/delete' },
              { key: 'r', label: 'refresh' },
              { key: 'esc', label: 'back' },
              { key: '', label: '✓ synced ⚠ drift' },
            ]}
          />
        </Box>
      ) : null}
      {!busy && mode === 'actions' ? (
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
