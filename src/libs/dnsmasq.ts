import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { homedir, platform, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import envPaths from 'env-paths';
import { execa } from 'execa';

const paths = envPaths('hostly', { suffix: '' });

export const DNSMASQ_PORT = 19_053;

const LAUNCHD_LABEL = 'dev.hostly.dnsmasq';
const RESOLVER_DIR = '/etc/resolver';
const RESOLVER_MARKER = '# managed by hostly';

const configPath = join(paths.config, 'dnsmasq.conf');

function launchAgentPath(): string {
  return join(homedir(), 'Library', 'LaunchAgents', `${LAUNCHD_LABEL}.plist`);
}

async function dnsmasqBin(): Promise<string | undefined> {
  try {
    const { stdout } = await execa('command', ['-v', 'dnsmasq'], {
      shell: true,
    });
    return stdout.trim() || undefined;
  } catch {
    return undefined;
  }
}

function buildConfig(bases: string[]): string {
  const lines = [
    `# ${RESOLVER_MARKER}`,
    `port=${DNSMASQ_PORT}`,
    'listen-address=127.0.0.1',
    'bind-interfaces',
    'no-resolv',
    'no-hosts',
    ...bases.map((base) => `address=/${base}/127.0.0.1`),
    '',
  ];
  return lines.join('\n');
}

function buildPlist(bin: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LAUNCHD_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${bin}</string>
    <string>--keep-in-foreground</string>
    <string>--conf-file=${configPath}</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
</dict>
</plist>
`;
}

export function managedBases(): string[] {
  try {
    return readFileSync(configPath, 'utf8')
      .split('\n')
      .map((line) => /^address=\/(.+?)\/127\.0\.0\.1$/.exec(line.trim())?.[1])
      .filter((base): base is string => Boolean(base));
  } catch {
    return [];
  }
}

function resolverContent(): string {
  return `${RESOLVER_MARKER}\nnameserver 127.0.0.1\nport ${DNSMASQ_PORT}\n`;
}

function managedResolverFiles(): string[] {
  if (!existsSync(RESOLVER_DIR)) {
    return [];
  }

  return readdirSync(RESOLVER_DIR).filter((name) => {
    try {
      return readFileSync(join(RESOLVER_DIR, name), 'utf8').includes(
        RESOLVER_MARKER,
      );
    } catch {
      return false;
    }
  });
}

async function syncResolvers(
  desired: string[],
): Promise<{ elevated: boolean }> {
  const existing = managedResolverFiles();
  const want = new Set(desired);
  const content = resolverContent();

  const toWrite = desired.filter((base) => {
    const file = join(RESOLVER_DIR, base);
    try {
      return readFileSync(file, 'utf8') !== content;
    } catch {
      return true;
    }
  });
  const toRemove = existing.filter((name) => !want.has(name));

  if (toWrite.length === 0 && toRemove.length === 0) {
    return { elevated: false };
  }

  const stageDir = mkdtempSync(join(tmpdir(), 'hostly-resolver-'));
  const script = [`#!/bin/sh`, 'set -e', `mkdir -p ${RESOLVER_DIR}`];

  for (const base of toWrite) {
    const staged = join(stageDir, base);
    writeFileSync(staged, content, 'utf8');
    script.push(`cp '${staged}' '${join(RESOLVER_DIR, base)}'`);
  }

  for (const name of toRemove) {
    script.push(`rm -f '${join(RESOLVER_DIR, name)}'`);
  }

  const scriptPath = join(stageDir, 'apply.sh');
  writeFileSync(scriptPath, script.join('\n') + '\n', 'utf8');
  await execa('sudo', ['sh', scriptPath], { stdio: 'inherit' });
  return { elevated: true };
}

async function reloadAgent(bin: string): Promise<void> {
  const filePath = launchAgentPath();
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, buildPlist(bin), 'utf8');
  await execa('launchctl', ['unload', filePath]).catch(() => undefined);
  await execa('launchctl', ['load', filePath]);
}

async function uninstallAgent(): Promise<void> {
  const filePath = launchAgentPath();
  await execa('launchctl', ['unload', filePath]).catch(() => undefined);
  rmSync(filePath, { force: true });
}

async function teardown(): Promise<{ elevated: boolean }> {
  await uninstallAgent();
  rmSync(configPath, { force: true });
  return syncResolvers([]);
}

export async function sync(bases: string[]): Promise<{ elevated: boolean }> {
  const installed = existsSync(configPath) || existsSync(launchAgentPath());

  if (platform() !== 'darwin') {
    if (bases.length > 0) {
      throw new Error(
        'Wildcard domains are only supported on macOS for now. Register a concrete host instead.',
      );
    }

    return { elevated: false };
  }

  if (bases.length === 0) {
    return installed ? teardown() : { elevated: false };
  }

  const bin = await dnsmasqBin();
  if (!bin) {
    throw new Error(
      'dnsmasq is required for wildcard domains but was not found on PATH. Install it with `brew install dnsmasq`.',
    );
  }

  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, buildConfig(bases), 'utf8');
  await reloadAgent(bin);
  return syncResolvers(bases);
}
