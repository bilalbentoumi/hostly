import type { ReactNode } from 'react';

export type Screen = 'menu' | 'domains' | 'proxy' | 'certificate' | 'daemon';

export type MenuChoice = { label: string; value: Screen | 'quit' };

export type ProxyAction = 'start' | 'stop' | 'sync';

export type DaemonAction = 'install' | 'uninstall';

export type CertAction = 'trust' | 'untrust';

export type DomainsMode = 'list' | 'add' | 'actions' | 'edit' | 'remove';

export type ListItem = { label: string; value: string };

export type SaveDomainFormProps = {
  readonly onSubmit: (host: string, port: number, https: boolean) => void;
  readonly onCancel: () => void;
  readonly title?: string;
  readonly initialData?: { host: string; port: number; https: boolean };
};

export type KeyHintsProps = {
  readonly hints: { key: string; label: string }[];
};

export type HeaderProps = {
  readonly subContent?: ReactNode;
};

export type StatusLineProps = {
  readonly busy?: boolean;
  readonly busyLabel?: string;
  readonly error?: string;
  readonly info?: string;
};
