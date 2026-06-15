export function HowItWorks() {
  return (
    <section
      className="mx-auto max-w-content px-6 py-20"
      id="how-it-works">
      <div className="section-label">How It Works</div>
      <h2 className="section-title">
        Up and running
        <br />
        in three steps
      </h2>
      <p className="section-desc">One command to install, one to run.</p>
      <div className="flex flex-col divide-y divide-line">
        <div className="flex gap-6 py-7 max-md:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent font-mono text-[15px] font-bold text-on-accent">
            1
          </div>
          <div>
            <h3 className="mb-1.5 font-mono text-[16px] font-bold tracking-[-0.2px]">
              Install hostly &amp; Caddy
            </h3>
            <p className="text-sm leading-[1.6] text-secondary">
              hostly is a Node CLI and uses{' '}
              <a
                href="https://caddyserver.com"
                target="_blank"
                rel="noopener noreferrer">
                Caddy
              </a>{' '}
              as its reverse proxy. Install both and make sure{' '}
              <code>caddy</code> is on your PATH.
            </p>
            <div className="mt-3 overflow-x-auto rounded border border-line bg-code px-4 py-3 font-mono text-[13px] text-code">
              <span className="text-tertiary">$</span> npm install -g hostly
              <br />
              <span className="text-tertiary">$</span> brew install caddy{' '}
              <span className="text-tertiary"># or your package manager</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6 py-7 max-md:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent font-mono text-[15px] font-bold text-on-accent">
            2
          </div>
          <div>
            <h3 className="mb-1.5 font-mono text-[16px] font-bold tracking-[-0.2px]">
              Run hostly &amp; add a domain
            </h3>
            <p className="text-sm leading-[1.6] text-secondary">
              Launch the interactive menu, open{' '}
              <strong>Domains → Add domain</strong>, and enter a host, target
              port, and scheme. Trust the local CA once from the{' '}
              <strong>Certificate</strong> screen.
            </p>
            <div className="mt-3 overflow-x-auto rounded border border-line bg-code px-4 py-3 font-mono text-[13px] text-code">
              <span className="text-tertiary">Host:</span> app.local
              <br />
              <span className="text-tertiary">Port:</span>{' '}
              <span className="text-success">3000</span>
              <br />
              <span className="text-tertiary">Scheme:</span> https
            </div>
          </div>
        </div>
        <div className="flex gap-6 py-7 max-md:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent font-mono text-[15px] font-bold text-on-accent">
            3
          </div>
          <div>
            <h3 className="mb-1.5 font-mono text-[16px] font-bold tracking-[-0.2px]">
              Open in your browser
            </h3>
            <p className="text-sm leading-[1.6] text-secondary">
              That&apos;s it. Visit <strong>https://app.local</strong> in any
              browser — valid certificate, no warnings, proxied to your local
              dev server. Install the boot daemon so routes survive a restart.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
