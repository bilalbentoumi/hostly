#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { render } from 'ink';

import meow from 'meow';
import { App } from './app.js';
import * as domains from './libs/domains.js';

const cli = meow(
  `
	Usage
	  $ local-edge          Launch the interactive local domain manager
	  $ local-edge sync     Re-apply saved domains to Caddy, then exit

	The sync command restores proxy routes after Caddy (re)starts, since
	Caddy's admin-API config is not persisted across restarts. Run it at
	boot via a launchd/systemd daemon. It does not touch /etc/hosts, which
	already persists across reboots.

	Requirements
	  - Caddy installed and on PATH (https://caddyserver.com)
`,
  {
    importMeta: import.meta,
  },
);

if (cli.input[0] === 'sync') {
  try {
    await domains.applyToCaddy();
    console.log('local-edge: applied saved domains to Caddy');
  } catch (error) {
    console.error(`local-edge sync failed: ${(error as Error).message}`);
    process.exit(1);
  }
} else {
  execSync('sudo -v', { stdio: 'inherit' });
  render(<App />);
}
