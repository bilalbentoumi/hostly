import { execa } from 'execa';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const LAUNCHD_LABEL = 'dev.local-edge.sync';
const SYSTEMD_UNIT = 'local-edge-sync.service';

export type DaemonResult = {
  platform: NodeJS.Platform;
  path: string;
};

export type DaemonStatus = {
  /** The service definition file exists on disk. */
  installed: boolean;
  /** The service manager (launchd/systemd) has it registered/enabled. */
  loaded: boolean;
  path: string;
};

function syncCommand(): { program: string; args: string[] } {
  const here = dirname(fileURLToPath(import.meta.url));
  const cliPath = resolve(here, '../cli.js');
  return { program: process.execPath, args: [cliPath, 'sync'] };
}

function launchAgentPath(): string {
  return join(homedir(), 'Library', 'LaunchAgents', `${LAUNCHD_LABEL}.plist`);
}

function systemdUnitPath(): string {
  return join(homedir(), '.config', 'systemd', 'user', SYSTEMD_UNIT);
}

function buildPlist(): string {
  const { program, args } = syncCommand();
  const programArguments = [program, ...args]
    .map((value) => `    <string>${value}</string>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LAUNCHD_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
${programArguments}
  </array>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>
`;
}

function buildUnit(): string {
  const { program, args } = syncCommand();
  const execStart = [program, ...args].join(' ');

  return `[Unit]
Description=local-edge sync (restore Caddy routes after a restart)
After=network-online.target

[Service]
Type=oneshot
ExecStart=${execStart}

[Install]
WantedBy=default.target
`;
}

async function installLaunchd(): Promise<DaemonResult> {
  const filePath = launchAgentPath();
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, buildPlist(), 'utf8');

  // Reloading: unload first so a re-install picks up changes. Ignore the
  // error when nothing is loaded yet.
  await execa('launchctl', ['unload', filePath]).catch(() => undefined);
  await execa('launchctl', ['load', filePath]);

  return { platform: 'darwin', path: filePath };
}

async function installSystemd(): Promise<DaemonResult> {
  const filePath = systemdUnitPath();
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, buildUnit(), 'utf8');

  await execa('systemctl', ['--user', 'daemon-reload']);
  await execa('systemctl', ['--user', 'enable', '--now', SYSTEMD_UNIT]);

  return { platform: 'linux', path: filePath };
}

export async function daemonStatus(): Promise<DaemonStatus> {
  switch (platform()) {
    case 'darwin': {
      const filePath = launchAgentPath();
      const loaded = await execa('launchctl', ['list', LAUNCHD_LABEL])
        .then(() => true)
        .catch(() => false);
      return { installed: existsSync(filePath), loaded, path: filePath };
    }

    case 'linux': {
      const filePath = systemdUnitPath();
      const loaded = await execa('systemctl', [
        '--user',
        'is-enabled',
        SYSTEMD_UNIT,
      ])
        .then(() => true)
        .catch(() => false);
      return { installed: existsSync(filePath), loaded, path: filePath };
    }

    default:
      throw new Error(`Unsupported platform: ${platform()}`);
  }
}

export async function installDaemon(): Promise<DaemonResult> {
  switch (platform()) {
    case 'darwin':
      return installLaunchd();
    case 'linux':
      return installSystemd();
    default:
      throw new Error(`Unsupported platform: ${platform()}`);
  }
}

export async function uninstallDaemon(): Promise<DaemonResult> {
  switch (platform()) {
    case 'darwin': {
      const filePath = launchAgentPath();
      await execa('launchctl', ['unload', filePath]).catch(() => undefined);
      rmSync(filePath, { force: true });
      return { platform: 'darwin', path: filePath };
    }

    case 'linux': {
      const filePath = systemdUnitPath();
      await execa('systemctl', [
        '--user',
        'disable',
        '--now',
        SYSTEMD_UNIT,
      ]).catch(() => undefined);
      rmSync(filePath, { force: true });
      await execa('systemctl', ['--user', 'daemon-reload']).catch(
        () => undefined,
      );
      return { platform: 'linux', path: filePath };
    }

    default:
      throw new Error(`Unsupported platform: ${platform()}`);
  }
}
