import { Box, Text } from 'ink';

import type { HeaderProps } from '../types/index.js';

const LOGO_LINES = [
  '██╗  ██╗ ██████╗ ███████╗████████╗██╗     ██╗   ██╗',
  '██║  ██║██╔═══██╗██╔════╝╚══██╔══╝██║     ╚██╗ ██╔╝',
  '███████║██║   ██║███████╗   ██║   ██║      ╚████╔╝ ',
  '██╔══██║██║   ██║╚════██║   ██║   ██║       ╚██╔╝  ',
  '██║  ██║╚██████╔╝███████║   ██║   ███████╗   ██║   ',
  '╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ',
];

// Horizontal gradient stops: blue -> purple -> pink.
const GRADIENT_STOPS: ReadonlyArray<readonly [number, number, number]> = [
  [77, 140, 255],
  [138, 111, 224],
  [216, 107, 176],
];

const LOGO_WIDTH = Math.max(...LOGO_LINES.map(line => line.length));

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function colorAt(position: number): string {
  const clamped = Math.min(Math.max(position, 0), 1);
  const segment = clamped * (GRADIENT_STOPS.length - 1);
  const index = Math.min(Math.floor(segment), GRADIENT_STOPS.length - 2);
  const t = segment - index;
  const [r1, g1, b1] = GRADIENT_STOPS[index]!;
  const [r2, g2, b2] = GRADIENT_STOPS[index + 1]!;

  return (
    '#' +
    [lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t)]
      .map(value => value.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function Header({ subContent }: HeaderProps) {
  return (
    <Box flexDirection="column">
      <Box flexDirection="column" marginY={1}>
        {LOGO_LINES.map((line, lineIndex) => (
          <Text key={lineIndex}>
            {[...line].map((char, columnIndex) => (
              <Text key={columnIndex} color={colorAt(columnIndex / (LOGO_WIDTH - 1))}>
                {char}
              </Text>
            ))}
          </Text>
        ))}
      </Box>
      {subContent}
    </Box>
  );
}
