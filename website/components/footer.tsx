const GITHUB_URL = 'https://github.com/bilalbentoumi/hostly';
const NPM_URL = 'https://www.npmjs.com/package/hostly';

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8 text-center">
      <div className="mx-auto flex max-w-wide items-center justify-between max-md:flex-col max-md:gap-4">
        <div className="text-[13px] text-tertiary">
          hostly {'—'} a local domain manager for the terminal.
        </div>
        <ul className="flex gap-5">
          <li>
            <a
              href="/docs"
              className="text-[13px] text-tertiary transition-colors hover:text-primary">
              Docs
            </a>
          </li>
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-tertiary transition-colors hover:text-primary">
              GitHub
            </a>
          </li>
          <li>
            <a
              href={NPM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-tertiary transition-colors hover:text-primary">
              npm
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
