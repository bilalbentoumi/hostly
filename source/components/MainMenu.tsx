import { Box, Text, useApp } from 'ink';
import SelectInput from 'ink-select-input';

export type Screen = 'menu' | 'domains' | 'proxy';

type Choice = { label: string; value: Screen | 'quit' };

const items: Choice[] = [
  { label: '🌐  Domains', value: 'domains' },
  { label: '🚦  Proxy & Caddy', value: 'proxy' },
  { label: '⏻   Quit', value: 'quit' },
];

export function Header() {
  const logo = `
██╗      ██████╗  ██████╗ █████╗ ██╗     ███████╗██████╗  ██████╗ ███████╗
██║     ██╔═══██╗██╔════╝██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝ ██╔════╝
██║     ██║   ██║██║     ███████║██║     █████╗  ██║  ██║██║  ███╗█████╗
██║     ██║   ██║██║     ██╔══██║██║     ██╔══╝  ██║  ██║██║   ██║██╔══╝
███████╗╚██████╔╝╚██████╗██║  ██║███████╗███████╗██████╔╝╚██████╔╝███████╗
╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝
`;

  return (
    <Box flexDirection="column">
      <Text color="cyan">{logo}</Text>
      <Text color="gray">local domain manager</Text>
    </Box>
  );
}

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
      <Box marginTop={1}>
        <Text dimColor>↑↓ navigate | ↵ select | esc back | ctrl+c quit</Text>
      </Box>
    </Box>
  );
}
