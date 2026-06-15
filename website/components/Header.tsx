import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { IoMoonSharp, IoSunnySharp } from 'react-icons/io5';
import { RiNpmjsFill } from 'react-icons/ri';

import { GITHUB_URL, NPM_URL, STORAGE_KEY } from '../lib/constants';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial =
      stored === 'light' || stored === 'dark' ? stored : getSystemTheme();
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = e.matches ? 'dark' : 'light';
        setTheme(t);
        document.documentElement.setAttribute('data-theme', t);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-[100] border-b border-line bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px] dark:bg-[rgba(0,0,0,0.6)]">
      <div className="mx-auto flex h-[64px] max-w-wide items-center justify-between px-6">
        <a
          href="/"
          className="flex items-center gap-2 text-base font-bold tracking-[-0.3px] text-primary">
          <img src="/icon.svg" width={24} height={24} />
          hostly
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <a
              href="#features"
              className="text-sm font-medium text-secondary transition-colors hover:text-primary">
              Features
            </a>
          </li>
          <li>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-secondary transition-colors hover:text-primary">
              How It Works
            </a>
          </li>
          <li>
            <a
              href="/docs"
              className="text-sm font-medium text-secondary transition-colors hover:text-primary">
              Docs
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-2">
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded border border-line !text-secondary transition-colors hover:bg-tertiary hover:text-primary"
            aria-label="npm package">
            <RiNpmjsFill size={20} />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded border border-line !text-secondary transition-colors hover:bg-tertiary hover:text-primary"
            aria-label="GitHub repository">
            <FaGithub size={20} />
          </a>
          <button
            className="flex h-9 w-9 items-center justify-center rounded border border-line bg-transparent !text-secondary transition-colors hover:bg-tertiary hover:text-primary"
            onClick={toggleTheme}
            aria-label="Toggle theme">
            {theme === 'dark' ? (
              <IoMoonSharp size={20} />
            ) : (
              <IoSunnySharp size={20} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
