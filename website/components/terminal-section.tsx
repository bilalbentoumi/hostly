import { TerminalPreview } from '../components/terminal-preview';

export function TerminalSection() {
  return (
    <section className="mx-auto max-w-preview animate-fade-up px-6 pb-20 [animation-delay:400ms]">
      <div className="mb-6 text-center">
        <h2 className="mb-2 font-mono text-[clamp(22px,4vw,30px)] font-bold tracking-[-0.5px]">
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
