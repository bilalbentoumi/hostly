import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

// The site is a GitHub Pages project page served from
// https://bilalbentoumi.github.io/hostly/, so every asset and link must be
// prefixed with the repo subpath. `PAGES_BASE_PATH` is injected by the
// actions/configure-pages step in CI; it is empty locally so `next dev`
// and local builds stay at the root.
const basePath = process.env.PAGES_BASE_PATH || ''

export default withNextra({
  output: 'export',
  images: { unoptimized: true },
  basePath,
  // Exposed to the app so raw asset references (favicon, logo) can be
  // prefixed consistently on the server-rendered and hydrated markup.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
})
