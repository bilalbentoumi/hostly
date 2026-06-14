import { FeatureCard } from '../components/feature-card';

export function Features() {
  return (
    <section className="mx-auto max-w-wide px-6 pb-20 pt-5" id="features">
      <div className="section-label">And More</div>
      <h2 className="section-title">
        Built for the
        <br />
        command line
      </h2>
      <p className="section-desc">
        Everything hostly does, it does from your shell.
      </p>
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
        <FeatureCard
          icon={
            <>
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </>
          }
          title="Reverse Proxy"
          desc={
            <>
              Point <strong>app.local</strong> to{' '}
              <strong>127.0.0.1:3000</strong> and <strong>api.local</strong>{' '}
              to <strong>127.0.0.1:8080</strong>. Routes are pushed to Caddy
              over its admin API.
            </>
          }
        />
        <FeatureCard
          icon={
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
          }
          title="HTTP, HTTPS, or both"
          desc={
            <>
              Pick a scheme per domain. <strong>https</strong> auto-redirects
              from <strong>http</strong>, <strong>http</strong> stays plain,
              or serve <strong>both</strong> with no redirect.
            </>
          }
        />
        <FeatureCard
          icon={
            <>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </>
          }
          title="Manages /etc/hosts"
          desc={
            <>
              hostly writes a fenced block to your hosts file and edits it via{' '}
              <strong>sudo</strong> only when needed. Your own entries are
              left untouched.
            </>
          }
        />
        <FeatureCard
          icon={
            <>
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </>
          }
          title="Boot Daemon"
          desc={
            <>
              Install a <strong>launchd</strong> agent (macOS) or{' '}
              <strong>systemd</strong> user unit (Linux) that runs{' '}
              <code>hostly sync</code> on boot to restore Caddy routes.
            </>
          }
        />
        <FeatureCard
          icon={
            <>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </>
          }
          title="Drift Detection"
          desc={
            <>
              Each domain shows <strong>✓ synced</strong> or{' '}
              <strong>⚠ drift</strong> so you can see at a glance whether the
              hosts file and Caddy match your registry.
            </>
          }
        />
        <FeatureCard
          icon={
            <>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </>
          }
          title="Zero-Config Registry"
          desc={
            <>
              Domains are stored as plain JSON in your OS config directory.
              Trust the local CA once and HTTPS works across every browser.
            </>
          }
        />
      </div>
    </section>
  );
}
