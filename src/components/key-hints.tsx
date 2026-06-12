import { Box, Text } from 'ink';

type Props = {
  readonly hints: { key: string; label: string }[];
};

export default function KeyHints({ hints }: Props) {
  return (
    <Box marginTop={1}>
      <Text dimColor>
        {hints.map((hint) => `${hint.key} ${hint.label}`).join(' | ')}
      </Text>
    </Box>
  );
}
