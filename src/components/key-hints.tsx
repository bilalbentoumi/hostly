import { Text } from 'ink';

import type { KeyHintsProps } from '../types/index.js';

export default function KeyHints({ hints }: KeyHintsProps) {
  return (
    <Text dimColor>
      {hints.map((hint) => `${hint.key} ${hint.label}`).join(' | ')}
    </Text>
  );
}
