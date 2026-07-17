import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Categoria } from "@/types";

export function CategoryChips({
  categorias,
  selected,
  onSelect,
}: {
  categorias: Categoria[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <Chip active={selected === null} onClick={() => onSelect(null)}>
        <Sparkles className="mr-1 h-3.5 w-3.5" /> Todas
      </Chip>
      {categorias.map((c) => (
        <Chip
          key={c.id}
          active={selected === c.id}
          onClick={() => onSelect(c.id)}
        >
          {c.nome}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 snap-start items-center rounded-full border px-4 py-1.5 text-sm font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-primary"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary-soft",
      )}
    >
      {children}
    </motion.button>
  );
}
