import { FaRegFileAlt } from 'react-icons/fa';
import { FiCheckCircle, FiLock } from 'react-icons/fi';
import { MdOutlineSettings } from 'react-icons/md';
import { PiHardDrives } from 'react-icons/pi';
import { TbArrowsCross } from 'react-icons/tb';

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
          icon={TbArrowsCross}
          title="Reverse Proxy"
          desc={
            <>
              Point <strong>app.local</strong> to{' '}
              <strong>127.0.0.1:3000</strong> and <strong>api.local</strong> to{' '}
              <strong>127.0.0.1:8080</strong>. Routes are pushed to Caddy over
              its admin API.
            </>
          }
        />
        <FeatureCard
          icon={FiLock}
          title="HTTP, HTTPS, or both"
          desc={
            <>
              Pick a scheme per domain. <strong>https</strong> auto-redirects
              from <strong>http</strong>, <strong>http</strong> stays plain, or
              serve <strong>both</strong> with no redirect.
            </>
          }
        />
        <FeatureCard
          icon={FaRegFileAlt}
          title="Manages /etc/hosts"
          desc={
            <>
              hostly writes a fenced block to your hosts file and edits it via{' '}
              <strong>sudo</strong> only when needed. Your own entries are left
              untouched.
            </>
          }
        />
        <FeatureCard
          icon={PiHardDrives}
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
          icon={FiCheckCircle}
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
          icon={MdOutlineSettings}
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
