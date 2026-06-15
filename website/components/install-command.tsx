import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { IoCheckmarkSharp } from 'react-icons/io5';

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
        {copied ? <IoCheckmarkSharp size={16} /> : <FiCopy size={16} />}
      </button>
    </div>
  );
}
