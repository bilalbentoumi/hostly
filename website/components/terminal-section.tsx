import { TerminalPreview } from '../components/terminal-preview';

export function TerminalSection() {
  return (
    <section className="mx-auto max-w-preview animate-fade-up px-6 pb-20 [animation-delay:400ms]">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-[clamp(24px,4vw,32px)] font-extrabold">
          See It In Action
        </h2>
        <p className="text-base text-secondary">
          Run <code>hostly</code> and manage everything from one interactive
          menu
        </p>
      </div>
      <TerminalPreview />
    </section>
  );
}
