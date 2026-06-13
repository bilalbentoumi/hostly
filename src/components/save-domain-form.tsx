import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useState } from 'react';

import type { SaveDomainFormProps } from '../types/index.js';
import { KeyHints } from './key-hints.js';

export function SaveDomainForm({
  onSubmit,
  onCancel,
  title = 'Add domain',
  initialData,
}: SaveDomainFormProps) {
  const [field, setField] = useState<'host' | 'port'>('host');
  const [host, setHost] = useState(initialData?.host ?? '');
  const [port, setPort] = useState(initialData ? String(initialData.port) : '');
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
    onSubmit(host.trim(), parsed);
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
      {error ? (
        <Box marginTop={1}>
          <Text color="red">✗ {error}</Text>
        </Box>
      ) : null}
      <Box marginTop={1}>
        <KeyHints
          hints={[
            { key: '↵', label: 'next/confirm' },
            { key: 'esc', label: 'cancel' },
          ]}
        />
      </Box>
    </Box>
  );
}
