import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

type Props = {
  readonly busy?: boolean;
  readonly busyLabel?: string;
  readonly error?: string;
  readonly info?: string;
};

/** A single status line: spinner while busy, otherwise an error or info note. */
export default function StatusLine({ busy, busyLabel, error, info }: Props) {
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
