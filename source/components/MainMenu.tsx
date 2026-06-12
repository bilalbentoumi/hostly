import { Box, Text, useApp } from 'ink';
import SelectInput from 'ink-select-input';

export type Screen = 'menu' | 'domains' | 'proxy' | 'certs';

type Props = {
  readonly onSelect: (screen: Screen) => void;
};

type Choice = { label: string; value: Screen | 'quit' };

const items: Choice[] = [
  { label: '🌐  Domains', value: 'domains' },
  { label: '🚦  Proxy & Caddy', value: 'proxy' },
  { label: '🔒  Certificates', value: 'certs' },
  { label: '⏻   Quit', value: 'quit' },
];

/** Top-level navigation menu. */
export default function MainMenu({ onSelect }: Props) {
  const { exit } = useApp();

  const handleSelect = (item: Choice) => {
    if (item.value === 'quit') {
      exit();
      return;
    }

    onSelect(item.value);
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          local-edge
        </Text>
        <Text dimColor> — local domain manager</Text>
      </Box>
      <SelectInput items={items} onSelect={handleSelect} />
      <Box marginTop={1}>
        <Text dimColor>↑↓ navigate · ↵ select · esc back · ctrl+c quit</Text>
      </Box>
    </Box>
  );
}
