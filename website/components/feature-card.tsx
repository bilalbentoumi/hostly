import { ComponentType } from 'react';
import { IconBaseProps } from 'react-icons/lib';

export function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: ComponentType<IconBaseProps>;
  title: string;
  desc: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-elevated px-6 py-7 transition-[box-shadow,border-color] hover:border-strong hover:shadow-lg">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-tertiary text-primary">
        <Icon size={20} />
      </div>
      <h3 className="mb-2 text-base font-bold tracking-[-0.2px]">{title}</h3>
      <p className="text-sm leading-[1.6] text-secondary">{desc}</p>
    </div>
  );
}
