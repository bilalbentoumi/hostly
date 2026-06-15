import { FeatureHeroCard } from '../components/feature-hero-card';

export function FeaturesHero() {
  return (
    <section className="mx-auto max-w-wide px-6 pb-20 pt-10">
      <div className="section-label">Core Features</div>
      <h2 className="section-title mb-10">Everything you need</h2>
      <div className="mx-auto grid max-w-wide grid-cols-2 gap-5 max-md:grid-cols-1 max-md:gap-4">
        <FeatureHeroCard
          variant="tui"
          title="Interactive Terminal UI"
          description="Add, edit, and remove domains from a keyboard-driven menu — no flags to memorize"
        />
        <FeatureHeroCard
          variant="https"
          title="Trusted HTTPS"
          description="Caddy's local CA signs real certificates your browser accepts — no warnings"
        />
        <FeatureHeroCard
          variant="proxy"
          title="Reverse Proxy"
          description="Route any custom domain to a local port via the Caddy admin API"
        />
        <FeatureHeroCard
          variant="daemon"
          title="Boot Daemon"
          description="hostly sync restores your routes after a restart, run by launchd or systemd"
        />
      </div>
    </section>
  );
}
