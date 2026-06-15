import { FaGithub } from 'react-icons/fa';

import { GITHUB_URL } from '../libs/constants';

export function CallToAction() {
  return (
    <section
      className="mx-auto max-w-narrow px-6 py-20 text-center"
      id="support">
      <div className="rounded-xl border border-line bg-elevated px-10 py-12 shadow-lg max-md:px-6 max-md:py-9">
        <h2 className="mb-3 font-mono text-[26px] font-bold tracking-[-0.5px]">
          Open source, forever free.
        </h2>
        <p className="mb-7 text-[15px] leading-[1.6] text-secondary">
          hostly is MIT licensed and built in the open. Found a bug or want a
          feature? Issues and pull requests are welcome on GitHub.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 max-[480px]:w-full max-[480px]:flex-col">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary">
            <FaGithub size={18} />
            Star on GitHub
          </a>
          <a href="/docs" className="btn btn-secondary">
            Read the docs
          </a>
        </div>
      </div>
    </section>
  );
}
