import { Box, useApp } from 'ink';
import SelectInput from 'ink-select-input';
import { Header } from './header.js';
import KeyHints from './key-hints.js';

export type Screen = 'menu' | 'domains' | 'proxy';

type Choice = { label: string; value: Screen | 'quit' };

const items: Choice[] = [
  { label: '🌐  Domains', value: 'domains' },
  { label: '🚦  Proxy & Caddy', value: 'proxy' },
  { label: '⏻   Quit', value: 'quit' },
];

type Props = {
  readonly onSelect: (screen: Screen) => void;
};

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
        <Header />
      </Box>
      <SelectInput items={items} onSelect={handleSelect} />
      <KeyHints
        hints={[
          { key: '↑↓', label: 'navigate' },
          { key: '↵', label: 'select' },
          { key: 'esc', label: 'back' },
          { key: 'ctrl+c', label: 'quit' },
        ]}
      />
    </Box>
  );
}
