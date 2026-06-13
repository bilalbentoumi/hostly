import { Box, Text, useApp } from 'ink';
import SelectInput from 'ink-select-input';

import { Header } from '../components/header.js';
import { KeyHints } from '../components/key-hints.js';
import { useAppStore } from '../stores/app-store.js';
import type { MenuChoice } from '../types/index.js';

const items: MenuChoice[] = [
  { label: 'Domains', value: 'domains' },
  { label: 'Proxy & Caddy', value: 'proxy' },
  { label: 'Quit', value: 'quit' },
];

export function MainMenuScreen() {
  const { exit } = useApp();
  const { setScreen } = useAppStore();

  const handleSelect = (item: MenuChoice) => {
    if (item.value === 'quit') {
      exit();
      return;
    }
    setScreen(item.value);
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
