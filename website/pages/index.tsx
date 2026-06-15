import Head from 'next/head';
import { ThemeProvider } from 'next-themes';

import { CallToAction } from '../components/call-to-action';
import { Features } from '../components/features';
import { FeaturesHero } from '../components/features-hero';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { HeroSection } from '../components/hero-section';
import { HowItWorks } from '../components/how-it-works';
import { TerminalSection } from '../components/terminal-section';

export default function LandingPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" storageKey="theme">
      <div className="landing-page">
        <Head>
          <title>hostly — Local Domain Manager for the Terminal</title>
          <link rel="icon" href="/icon.svg" />
          <meta
            name="description"
            content="hostly is an interactive CLI that maps custom domains like app.local to your local dev servers, with trusted HTTPS via Caddy, a reverse proxy, and a boot daemon. Install with npm."
          />
          <meta
            property="og:title"
            content="hostly — Local Domain Manager for the Terminal"
          />
          <meta
            property="og:description"
            content="An interactive CLI for local domains: custom *.local names, trusted HTTPS via Caddy, reverse proxy, and a boot daemon."
          />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="hostly — Local Domain Manager for the Terminal"
          />
          <meta
            name="twitter:description"
            content="An interactive CLI for local domains: custom *.local names, trusted HTTPS via Caddy, reverse proxy, and a boot daemon."
          />
        </Head>
        <Header />
        <HeroSection />
        <TerminalSection />
        <FeaturesHero />
        <Features />
        <HowItWorks />
        <CallToAction />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
