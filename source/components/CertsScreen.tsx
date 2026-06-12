import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { dirname, join } from 'node:path';
import { useCallback, useEffect, useState } from 'react';

import type { CertInfo, TrustStatus } from '../lib/certs.js';
import * as certs from '../lib/certs.js';
import { registryPath } from '../lib/config.js';
import StatusLine from './StatusLine.js';

type Props = {
  readonly onBack: () => void;
};

const exportPath = join(dirname(registryPath), 'local-edge-root.crt');

const trustLabel: Record<TrustStatus, string> = {
  trusted: 'trusted by system keychain',
  untrusted: 'not in system keychain',
  unsupported: 'trust check unsupported on this OS',
  unknown: 'unknown',
};

const trustColor: Record<TrustStatus, string> = {
  trusted: 'green',
  untrusted: 'yellow',
  unsupported: 'gray',
  unknown: 'gray',
};

/** Inspect Caddy's internal CA and export its root certificate. */
export default function CertsScreen({ onBack }: Props) {
  const [cert, setCert] = useState<CertInfo>();
  const [trust, setTrust] = useState<TrustStatus>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      setCert(await certs.info());
      setTrust(await certs.trusted());
    } finally {
      setBusy(false);
    }
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

  const doExport = async () => {
    setError(undefined);
    setInfo(undefined);
    try {
      await certs.exportRoot(exportPath);
      setInfo(`Root certificate written to ${exportPath}`);
    } catch (error_) {
      setError((error_ as Error).message);
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Certificates
        </Text>
      </Box>

      {cert === undefined ? (
        <Text dimColor>Loading CA info…</Text>
      ) : cert.available ? (
        <Box flexDirection="column" marginBottom={1}>
          <Text>CA: {cert.name ?? 'Caddy internal CA'}</Text>
          {cert.rootCommonName ? (
            <Text dimColor>Root CN: {cert.rootCommonName}</Text>
          ) : null}
          <Text>
            Root certificate:{' '}
            {cert.hasRoot ? (
              <Text color="green">available</Text>
            ) : (
              <Text color="red">missing</Text>
            )}
          </Text>
          {trust ? (
            <Text color={trustColor[trust]}>Trust: {trustLabel[trust]}</Text>
          ) : null}
        </Box>
      ) : (
        <Box marginBottom={1}>
          <Text color="yellow">
            Internal CA unavailable — start Caddy and add an HTTPS domain first.
          </Text>
        </Box>
      )}

      {cert?.hasRoot ? (
        <SelectInput
          items={[{ label: '💾  Export root certificate', value: 'export' }]}
          isFocused={!busy}
          onSelect={() => void doExport()}
        />
      ) : null}

      <Box marginTop={1}>
        <StatusLine error={error} info={info} />
      </Box>
      <Box marginTop={1}>
        <Text dimColor>esc back</Text>
      </Box>
    </Box>
  );
}
