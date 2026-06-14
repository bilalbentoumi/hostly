import { useState } from 'react';

const INSTALL_CMD = 'npm install -g hostly';

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(INSTALL_CMD);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="inline-flex items-center gap-[14px] rounded border border-line bg-elevated py-3 pl-[18px] pr-[14px] font-mono text-[15px] shadow">
      <span className="font-bold text-accent">$</span>
      <span className="text-primary">{INSTALL_CMD}</span>
      <button
        className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border transition-colors ${
          copied
            ? 'border-success text-success'
            : 'border-line bg-tertiary text-secondary hover:bg-accent-light hover:text-accent'
        }`}
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy install command'}>
        {copied ? (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}
