import { type ReactNode } from 'react';

type Variant = 'tui' | 'https' | 'proxy' | 'daemon';

interface FeatureHeroCardProps {
  variant: Variant;
  title: string;
  description: string;
}

const icons: Record<Variant, ReactNode> = {
  tui: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 9l3 3-3 3" />
      <line x1="12" y1="15" x2="16" y2="15" />
    </svg>
  ),
  https: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  proxy: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  ),
  daemon: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
};

const previewContent: Record<Variant, ReactNode> = {
  tui: (
    <pre className="m-0 box-border h-full w-full overflow-hidden whitespace-pre-wrap break-words border-t border-line bg-[#0d1117] px-4 py-[14px] font-mono text-[11.5px] leading-[1.6] text-[#c9d1d9] max-md:rounded max-md:border">
      <span className="text-[#56d4dd]">Local Domain Manager</span>
      {'\n'}
      <span className="text-[#58a6ff]">❯ Domains</span>
      {'\n  Proxy & Caddy\n  Certificate\n  Daemon'}
    </pre>
  ),
  https: (
    <pre className="m-0 box-border h-full w-full overflow-hidden whitespace-pre-wrap break-words border-t border-line bg-[#0d1117] px-4 py-[14px] font-mono text-[11.5px] leading-[1.6] text-[#c9d1d9] max-md:rounded max-md:border">
      <span className="font-bold text-[#28c840]">$</span> hostly{'  '}
      <span className="text-[#6e7681]"># Certificate</span>
      {'\n'}
      Local CA: <span className="text-[#28c840]">Hostly Local CA</span>
      {'\n'}
      <span className="text-[#28c840]">✓</span> installed into the system trust
      store
    </pre>
  ),
  proxy: (
    <pre className="m-0 box-border h-full w-full overflow-hidden whitespace-pre-wrap break-words border-t border-line bg-[#0d1117] px-4 py-[14px] font-mono text-[11.5px] leading-[1.6] text-[#c9d1d9] max-md:rounded max-md:border">
      <span className="text-[#28c840]">✓</span> https://app.local{'  '}
      <span className="text-[#8b949e]">→</span> 127.0.0.1:3000
      {'\n'}
      <span className="text-[#28c840]">✓</span> https://api.local{'  '}
      <span className="text-[#8b949e]">→</span> 127.0.0.1:8080
    </pre>
  ),
  daemon: (
    <pre className="m-0 box-border h-full w-full overflow-hidden whitespace-pre-wrap break-words border-t border-line bg-[#0d1117] px-4 py-[14px] font-mono text-[11.5px] leading-[1.6] text-[#c9d1d9] max-md:rounded max-md:border">
      <span className="font-bold text-[#28c840]">$</span> hostly sync
      {'\n'}
      <span className="text-[#28c840]">✓</span> applied saved domains to Caddy
      {'\n'}
      <span className="text-[#6e7681]">runs at boot via launchd / systemd</span>
    </pre>
  ),
};

export function FeatureHeroCard({
  variant,
  title,
  description,
}: FeatureHeroCardProps) {
  return (
    <div
      className="group relative min-h-[200px] cursor-default overflow-hidden rounded-lg border border-line bg-elevated px-6 py-7 transition-[transform,box-shadow,border-color] duration-300 ease-in-out [will-change:transform] hover:-translate-y-1 hover:border-accent hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] max-md:min-h-0 max-md:px-5 max-md:py-6 max-md:hover:translate-y-0"
      tabIndex={0}
      role="article"
      aria-label={`${title} feature`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded bg-tertiary text-primary transition-[background] duration-300 ease-in-out group-hover:bg-accent-light">
        {icons[variant]}
      </div>
      <h3 className="mb-2 text-[17px] font-bold tracking-[-0.3px] text-primary">
        {title}
      </h3>
      <p className="text-sm leading-[1.6] text-secondary">{description}</p>
      <div className="absolute inset-x-0 bottom-0 h-0 scale-95 overflow-hidden opacity-0 transition-[height,opacity,transform] duration-300 ease-in-out group-hover:h-[120px] group-hover:scale-100 group-hover:opacity-100 group-focus:h-[120px] group-focus:scale-100 group-focus:opacity-100 max-md:relative max-md:mt-4 max-md:h-auto max-md:scale-100 max-md:opacity-100">
        {previewContent[variant]}
      </div>
    </div>
  );
}
