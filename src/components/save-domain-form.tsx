import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import { useState } from 'react';

import type {
  DomainScheme,
  ListItem,
  SaveDomainFormProps,
} from '../types/index.js';
import { KeyHints } from './key-hints.js';

type Field = 'host' | 'port' | 'scheme';

const SCHEME_ITEMS: ListItem[] = [
  { label: 'https (redirect http → https)', value: 'https' },
  { label: 'http (no TLS)', value: 'http' },
  { label: 'both (http + https, no redirect)', value: 'both' },
];

function schemeLabel(scheme: DomainScheme): string {
  return scheme === 'both' ? 'http + https' : scheme;
}

export function SaveDomainForm({
  onSubmit,
  onCancel,
  title = 'Add domain',
  initialData,
}: SaveDomainFormProps) {
  const [field, setField] = useState<Field>('host');
  const [host, setHost] = useState(initialData?.host ?? '');
  const [port, setPort] = useState(initialData ? String(initialData.port) : '');
  const [scheme, setScheme] = useState<DomainScheme>(
    initialData?.scheme ?? 'https',
  );
  const [error, setError] = useState<string>();

  useInput((_input, key) => {
    if (key.escape) {
      onCancel();
    }
  });

  const submitHost = (value: string) => {
    if (value.trim().length === 0) {
      setError('Host is required');
      return;
    }

    setError(undefined);
    setField('port');
  };

  const submitPort = (value: string) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
      setError('Port must be an integer between 1 and 65535');
      return;
    }

    setError(undefined);
    setField('scheme');
  };

  const submitScheme = (item: ListItem) => {
    const next = item.value as DomainScheme;
    setScheme(next);
    onSubmit(host.trim(), Number(port), next);
  };

  return (
    <Box flexDirection="column">
      <Text bold>{title}</Text>
      <Box marginTop={1}>
        <Text>{field === 'host' ? '▸ ' : '  '}Host: </Text>
        <TextInput
          value={host}
          focus={field === 'host'}
          placeholder="myapp.local"
          onChange={setHost}
          onSubmit={submitHost}
        />
      </Box>
      <Box>
        <Text>{field === 'port' ? '▸ ' : '  '}Port: </Text>
        <TextInput
          value={port}
          focus={field === 'port'}
          placeholder="3000"
          onChange={setPort}
          onSubmit={submitPort}
        />
      </Box>
      <Box>
        <Text>{field === 'scheme' ? '▸ ' : '  '}Scheme: </Text>
        {field === 'scheme' ? null : <Text>{schemeLabel(scheme)}</Text>}
      </Box>
      {field === 'scheme' ? (
        <Box marginLeft={2}>
          <SelectInput
            items={SCHEME_ITEMS}
            initialIndex={Math.max(
              SCHEME_ITEMS.findIndex((item) => item.value === scheme),
              0,
            )}
            onSelect={submitScheme}
          />
        </Box>
      ) : null}
      {error ? (
        <Box marginTop={1}>
          <Text color="red">✗ {error}</Text>
        </Box>
      ) : null}
      <Box marginTop={1}>
        <KeyHints
          hints={
            field === 'scheme'
              ? [
                  { key: '↑↓', label: 'select scheme' },
                  { key: '↵', label: 'confirm' },
                  { key: 'esc', label: 'cancel' },
                ]
              : [
                  { key: '↵', label: 'next/confirm' },
                  { key: 'esc', label: 'cancel' },
                ]
          }
        />
      </Box>
    </Box>
  );
}
