import type { Domain } from './config.js';

export type DomainStatus = Domain & {
  inHosts: boolean;
  inCaddy: boolean;
  synced: boolean;
};

export type SyncResult = {
  elevated: boolean;
  caddyError?: string;
};
