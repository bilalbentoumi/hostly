import { type ReactNode, useEffect, useState } from 'react';

type Scene = {
  id: string;
  label: string;
  command: string;
  body: ReactNode;
};

const AUTO_MS = 5000;

const c = {
  prompt: 'font-bold text-[#28c840]',
  cmd: 'text-[#c9d1d9]',
  cyan: 'text-[#56d4dd]',
  green: 'text-[#28c840]',
  yellow: 'text-[#e3b341]',
  gray: 'text-[#8b949e]',
  dim: 'text-[#6e7681]',
  accent: 'text-[#58a6ff]',
};

const MENU_ITEM = 'whitespace-pre';
const MENU_ITEM_ACTIVE = 'whitespace-pre font-semibold text-[#58a6ff]';

const LOGO = [
  '██╗  ██╗ ██████╗ ███████╗████████╗██╗     ██╗   ██╗',
  '██║  ██║██╔═══██╗██╔════╝╚══██╔══╝██║     ╚██╗ ██╔╝',
  '███████║██║   ██║███████╗   ██║   ██║      ╚████╔╝ ',
  '██╔══██║██║   ██║╚════██║   ██║   ██║       ╚██╔╝  ',
  '██║  ██║╚██████╔╝███████║   ██║   ███████╗   ██║   ',
  '╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ',
];

function Cursor() {
  return (
    <span className="ml-0.5 inline-block h-[1.05em] w-2 animate-term-blink bg-[#c9d1d9] align-text-bottom" />
  );
}

function Prompt({ command }: { command: string }) {
  return (
    <div className="whitespace-pre-wrap break-words">
      <span className={c.prompt}>$</span>{' '}
      <span className={c.cmd}>{command}</span>
      <Cursor />
    </div>
  );
}

function Hints({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-[14px] text-xs text-[#6e7681]">
      {items.map(([key, label]) => (
        <span key={label}>
          <span className="font-semibold text-[#c9d1d9]">{key}</span> {label}
        </span>
      ))}
    </div>
  );
}

const MenuScene = (
  <>
    <pre
      aria-hidden="true"
      className="mb-2 overflow-x-auto bg-[linear-gradient(90deg,#4d8cff_0%,#8a6fe0_50%,#d86bb0_100%)] bg-clip-text font-mono text-[11px] leading-[1.1] text-transparent max-md:text-[8px]">
      {LOGO.join('\n')}
    </pre>
    <div className={`${c.cyan} font-bold`}>Local Domain Manager</div>
    <div className="flex flex-col">
      <div className={MENU_ITEM_ACTIVE}>❯ Domains</div>
      <div className={MENU_ITEM}> Proxy &amp; Caddy</div>
      <div className={MENU_ITEM}> Certificate</div>
      <div className={MENU_ITEM}> Daemon</div>
      <div className={MENU_ITEM}> Quit</div>
    </div>
    <Hints
      items={[
        ['↑↓', 'navigate'],
        ['↵', 'select'],
        ['ctrl+c', 'quit'],
      ]}
    />
  </>
);

const DomainsScene = (
  <>
    <div className="font-bold">
      <span className={c.cyan}>Domains</span>{' '}
      <span className={c.gray}>— 3 registered</span>
    </div>
    <div className="flex flex-col">
      <div className={MENU_ITEM}> ＋ Add domain</div>
      <div className={MENU_ITEM_ACTIVE}>
        ❯ <span className={c.green}>✓</span> https://app.local{' '}
        <span className={c.gray}>→</span> 127.0.0.1:3000
      </div>
      <div className={MENU_ITEM}>
        {'  '}
        <span className={c.green}>✓</span> https://api.local{' '}
        <span className={c.gray}>→</span> 127.0.0.1:8080
      </div>
      <div className={MENU_ITEM}>
        {'  '}
        <span className={c.yellow}>⚠</span> http://docs.local{' '}
        <span className={c.gray}>→</span> 127.0.0.1:4000
      </div>
    </div>
    <Hints
      items={[
        ['↵', 'edit/delete'],
        ['r', 'refresh'],
        ['esc', 'back'],
        ['', '✓ synced  ⚠ drift'],
      ]}
    />
  </>
);

const AddDomainScene = (
  <>
    <div className="font-bold">Add domain</div>
    <div className="flex flex-col">
      <div>
        <span className={c.accent}>▸ </span>Host:{' '}
        <span className={c.green}>shop.local</span>
        <Cursor />
      </div>
      <div>
        {'  '}Port: <span className={c.gray}>3000</span>
      </div>
      <div>
        {'  '}Scheme: <span className={c.gray}>https</span>
      </div>
    </div>
    <Hints
      items={[
        ['↵', 'next/confirm'],
        ['esc', 'cancel'],
      ]}
    />
  </>
);

const CertificateScene = (
  <>
    <div className={`${c.cyan} font-bold`}>Certificate</div>
    <div className="flex flex-col">
      <div>
        Local CA: <span className={c.green}>Hostly Local CA</span>
      </div>
      <div className={c.dim}>
        {' '}
        Trusting installs the root cert so browsers accept your HTTPS domains.
      </div>
    </div>
    <div className="flex flex-col">
      <div className={MENU_ITEM_ACTIVE}>
        ❯ Trust local CA (install root certificate)
      </div>
      <div className={MENU_ITEM}>
        {' '}
        Untrust local CA (remove root certificate)
      </div>
    </div>
    <div className="mt-1">
      <span className={c.green}>✓</span> Local CA installed into the system
      trust store
    </div>
  </>
);

const DaemonScene = (
  <>
    <div className={`${c.cyan} font-bold`}>Daemon</div>
    <div className="flex flex-col">
      <div>
        Status: <span className={c.green}>installed &amp; loaded</span>
      </div>
      <div className={c.dim}> ~/Library/LaunchAgents/dev.hostly.sync.plist</div>
    </div>
    <div className="flex flex-col">
      <div className={MENU_ITEM_ACTIVE}>❯ Remove boot daemon</div>
    </div>
    <Hints
      items={[
        ['↵', 'select'],
        ['esc', 'back'],
      ]}
    />
  </>
);

const SyncScene = (
  <>
    <div className="mt-1">
      <span className={c.green}>✓</span> hostly: applied saved domains to Caddy
    </div>
    <div className="whitespace-pre-wrap break-words">
      <span className={c.prompt}>$</span> <Cursor />
    </div>
  </>
);

const SCENES: Scene[] = [
  { id: 'menu', label: 'Main menu', command: 'hostly', body: MenuScene },
  { id: 'domains', label: 'Domains', command: 'hostly', body: DomainsScene },
  { id: 'add', label: 'Add domain', command: 'hostly', body: AddDomainScene },
  {
    id: 'cert',
    label: 'Certificate',
    command: 'hostly',
    body: CertificateScene,
  },
  { id: 'daemon', label: 'Daemon', command: 'hostly', body: DaemonScene },
  { id: 'sync', label: 'Sync', command: 'hostly sync', body: SyncScene },
];

export function TerminalPreview() {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % SCENES.length);
    }, AUTO_MS);
    return () => window.clearTimeout(id);
  }, [index, autoplay]);

  const goTo = (next: number) => {
    setAutoplay(false);
    setIndex((next + SCENES.length) % SCENES.length);
  };

  const scene = SCENES[index];

  return (
    <div
      className="box-border overflow-hidden rounded-[14px] border border-[#30363d] bg-[#0d1117] font-mono shadow-xl [&_*]:box-border"
      role="region"
      aria-label="hostly CLI preview">
      <div className="relative flex h-11 items-center gap-[9px] border-b border-[#30363d] bg-[#161b22] px-4">
        <span className="inline-block h-[13px] w-[13px] rounded-full bg-[#ff5f57]" />
        <span className="inline-block h-[13px] w-[13px] rounded-full bg-[#febc2e]" />
        <span className="inline-block h-[13px] w-[13px] rounded-full bg-[#28c840]" />
        <span className="absolute left-1/2 -translate-x-1/2 text-xs text-[#8b949e]">
          hostly — zsh
        </span>
      </div>

      <div
        className="min-h-[420px] animate-term-fade px-[22px] py-5 text-[13.5px] leading-[1.55] text-[#c9d1d9] max-md:min-h-[380px] max-md:p-4 max-md:text-xs"
        key={scene.id}>
        <Prompt command={scene.command} />
        <div className="mt-[14px] flex flex-col gap-[10px]">{scene.body}</div>
      </div>

      <div className="relative flex min-h-[46px] items-center gap-[10px] border-t border-[#30363d] bg-[#161b22] px-[14px] py-[10px]">
        <button
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#30363d] bg-transparent text-base leading-none text-[#8b949e] hover:bg-white/5 hover:text-[#c9d1d9]"
          onClick={() => goTo(index - 1)}
          aria-label="Previous screen">
          ‹
        </button>
        <div className="flex items-center gap-1.5" aria-label="Preview screens">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              className={`h-2 cursor-pointer rounded-full border-none p-0 ${
                i === index ? 'w-[18px] bg-accent' : 'w-2 bg-[#30363d]'
              }`}
              onClick={() => goTo(i)}
              aria-label={`Show ${s.label}`}
            />
          ))}
        </div>
        <button
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#30363d] bg-transparent text-base leading-none text-[#8b949e] hover:bg-white/5 hover:text-[#c9d1d9]"
          onClick={() => goTo(index + 1)}
          aria-label="Next screen">
          ›
        </button>
        <span className="ml-auto text-xs text-[#8b949e] max-md:hidden">
          {scene.label}
        </span>
        {autoplay && (
          <div
            key={scene.id}
            className="absolute bottom-0 left-0 h-0.5 animate-term-progress bg-accent"
          />
        )}
      </div>
    </div>
  );
}
