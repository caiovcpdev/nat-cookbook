import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center"
    >
      {Icon ? (
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <h3 className="font-display text-xl">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </motion.div>
  );
}
