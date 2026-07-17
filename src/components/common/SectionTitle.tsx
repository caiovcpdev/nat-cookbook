import type { ReactNode } from "react";

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="font-display text-xl text-foreground sm:text-2xl">{children}</h2>
      {action}
    </div>
  );
}
