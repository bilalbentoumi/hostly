import { DocsThemeConfig } from 'nextra-theme-docs';
import { LogoText } from './components/logo-text';

const config: DocsThemeConfig = {
  logo: (
    <span className="flex items-center gap-2 text-base font-bold tracking-[-0.3px] text-primary">
      <img src="/icon.svg" width={24} height={24} />
      <LogoText className="mt-1" height={16} />
    </span>
  ),
  project: {
    link: 'https://github.com/bilalbentoumi/hostly',
  },
  docsRepositoryBase:
    'https://github.com/bilalbentoumi/hostly/tree/main/website',
  footer: {
    text: 'hostly — a local domain manager for the terminal.',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="hostly documentation - an interactive CLI for local domains with trusted HTTPS via Caddy, a reverse proxy, and a boot daemon."
      />
      <link rel="icon" href="/icon.svg" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s – hostly Docs',
    };
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  navigation: {
    prev: true,
    next: true,
  },
};

export default config;
