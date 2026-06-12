#!/usr/bin/env node
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

meow(
  `
	Usage
	  $ local-edge

	Launches the interactive local domain manager.

	Manage local dev domains (e.g. myapp.local): register domains, drive the
	Caddy reverse proxy via its admin API, keep /etc/hosts in sync, and inspect
	local SSL certificates from Caddy's internal CA.

	Requirements
	  - Caddy installed and on PATH (https://caddyserver.com)
`,
  {
    importMeta: import.meta,
  },
);

render(<App />);
