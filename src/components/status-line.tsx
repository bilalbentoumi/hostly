import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

import type { StatusLineProps } from '../types/index.js';

export function StatusLine({ busy, busyLabel, error, info }: StatusLineProps) {
  if (busy) {
    return (
      <Box>
        <Text color="cyan">
          <Spinner type="dots" />
        </Text>
        <Text> {busyLabel ?? 'Working…'}</Text>
      </Box>
    );
  }

  if (error) {
    return <Text color="red">✗ {error}</Text>;
  }

  if (info) {
    return <Text color="green">✓ {info}</Text>;
  }

  return null;
}
