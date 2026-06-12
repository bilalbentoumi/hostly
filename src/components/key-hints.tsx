import { Text } from 'ink';

type Props = {
  readonly hints: { key: string; label: string }[];
};

export default function KeyHints({ hints }: Props) {
  return (
    <Text dimColor>
      {hints.map((hint) => `${hint.key} ${hint.label}`).join(' | ')}
    </Text>
  );
}
