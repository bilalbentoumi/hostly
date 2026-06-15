import { InstallCommand } from '../components/install-command';
import { GITHUB_URL } from '../lib/constants';

type Tag = {
  label: string;
  pos: React.CSSProperties;
  delay: string;
  duration: string;
};

const TAGS: Tag[] = [
  { label: 'HTTPS', pos: { top: '8%', left: '5%' }, delay: '0s', duration: '18s' },
  { label: 'Reverse Proxy', pos: { top: '22%', right: '8%' }, delay: '2s', duration: '22s' },
  { label: 'Caddy', pos: { top: '45%', left: '2%' }, delay: '1s', duration: '20s' },
  { label: '/etc/hosts', pos: { top: '65%', right: '3%' }, delay: '3s', duration: '19s' },
  { label: 'TLS Certs', pos: { top: '80%', left: '10%' }, delay: '0.5s', duration: '24s' },
  { label: 'Port Routing', pos: { top: '15%', left: '18%' }, delay: '4s', duration: '21s' },
  { label: 'launchd', pos: { top: '55%', right: '12%' }, delay: '1.5s', duration: '17s' },
  { label: 'systemd', pos: { top: '35%', left: '8%' }, delay: '2.5s', duration: '23s' },
  { label: 'Daemon', pos: { top: '75%', right: '15%' }, delay: '3.5s', duration: '20s' },
  { label: 'Local CA', pos: { top: '10%', right: '20%' }, delay: '0.8s', duration: '25s' },
  { label: 'app.local', pos: { top: '90%', left: '22%' }, delay: '1.2s', duration: '19s' },
  { label: 'Local Domains', pos: { top: '50%', left: '15%' }, delay: '4.5s', duration: '22s' },
  { label: 'sync', pos: { top: '30%', right: '5%' }, delay: '2.8s', duration: '18s' },
  { label: 'TUI', pos: { top: '70%', left: '3%' }, delay: '1.8s', duration: '21s' },
  { label: 'Proxy', pos: { top: '85%', right: '10%' }, delay: '3.2s', duration: '24s' },
  { label: 'npm', pos: { top: '20%', left: '12%' }, delay: '0.3s', duration: '20s' },
  { label: 'Certs', pos: { top: '40%', right: '18%' }, delay: '2.2s', duration: '23s' },
  { label: 'Routing', pos: { top: '60%', left: '20%' }, delay: '3.8s', duration: '17s' },
];

// Mirrors the old :nth-child(3n) > :nth-child(odd) > default precedence: larger
// and fainter tags every third item, mid tags on the remaining odd positions.
function tagVariant(index: number): string {
  const n = index + 1;
  if (n % 3 === 0) return 'text-[20px] opacity-[0.04] animate-hero-tag-3';
  if (n % 2 === 1) return 'text-[16px] opacity-[0.08] animate-hero-tag-2';
  return 'text-[14px] opacity-[0.06] animate-hero-tag-1';
}

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-content overflow-hidden px-6 pb-20 pt-[140px] text-center max-md:px-5 max-md:pb-[60px] max-md:pt-[120px]">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {TAGS.map((tag, index) => (
          <span
            key={tag.label}
            className={`absolute whitespace-nowrap font-semibold tracking-[0.5px] text-primary ${tagVariant(index)}`}
            style={{ ...tag.pos, animationDelay: tag.delay, animationDuration: tag.duration }}>
            {tag.label}
          </span>
        ))}
      </div>

      <h1 className="relative z-[1] mb-5 animate-fade-up text-[clamp(36px,6vw,56px)] font-extrabold leading-[1.1] tracking-[-1.5px] [animation-delay:100ms] max-md:text-[32px]">
        Local domains,
        <br />
        from your terminal.
      </h1>
      <p className="relative z-[1] mx-auto mb-9 max-w-[560px] animate-fade-up text-lg leading-[1.6] text-secondary [animation-delay:200ms]">
        <strong>hostly</strong> is an interactive CLI that maps custom domains
        like <strong>app.local</strong> to your local dev servers — with trusted
        HTTPS, a reverse proxy, and a boot daemon. No GUI, no config files.
      </p>
      <div className="relative z-[1] flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:300ms] max-[480px]:w-full max-[480px]:flex-col">
        <InstallCommand />
      </div>
      <div className="relative z-[1] mt-4 flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:300ms] max-[480px]:w-full max-[480px]:flex-col">
        <a href="/docs" className="btn btn-primary">
          Read the docs
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </a>
      </div>
      <div className="relative z-[1] mt-6 flex animate-fade-up items-center justify-center gap-2 text-sm text-tertiary [animation-delay:400ms]">
        <span>
          Open source, MIT licensed. Requires{' '}
          <a
            href="https://caddyserver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent">
            Caddy
          </a>{' '}
          and Node 18+.
        </span>
      </div>
    </section>
  );
}
