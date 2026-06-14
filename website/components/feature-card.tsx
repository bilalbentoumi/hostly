export function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-elevated px-6 py-7 transition-[box-shadow,border-color] hover:border-strong hover:shadow-lg">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-tertiary text-primary">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <h3 className="mb-2 text-base font-bold tracking-[-0.2px]">{title}</h3>
      <p className="text-sm leading-[1.6] text-secondary">{desc}</p>
    </div>
  );
}
