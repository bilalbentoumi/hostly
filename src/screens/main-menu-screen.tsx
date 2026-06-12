import { Box, Text, useApp } from 'ink';
import SelectInput from 'ink-select-input';

import { Header } from '../components/header.js';
import KeyHints from '../components/key-hints.js';
import type { MenuChoice, Screen } from '../types/index.js';

const items: MenuChoice[] = [
  { label: '🌐  Domains', value: 'domains' },
  { label: '🚦  Proxy & Caddy', value: 'proxy' },
  { label: '⏻   Quit', value: 'quit' },
];

export type MainMenuScreenProps = {
  readonly onSelect: (screen: Screen) => void;
};

export default function MainMenuScreen({ onSelect }: MainMenuScreenProps) {
  const { exit } = useApp();

  const handleSelect = (item: MenuChoice) => {
    if (item.value === 'quit') {
      exit();
      return;
    }
    onSelect(item.value as Screen);
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Header
          subContent={
            <Text bold color="cyan">
              Local Domain Manager
            </Text>
          }
        />
      </Box>
      <SelectInput items={items} onSelect={handleSelect} />
      <Box marginTop={1}>
        <KeyHints
          hints={[
            { key: '↑↓', label: 'navigate' },
            { key: '↵', label: 'select' },
            { key: 'esc', label: 'back' },
            { key: 'ctrl+c', label: 'quit' },
          ]}
        />
      </Box>
    </Box>
  );
}
