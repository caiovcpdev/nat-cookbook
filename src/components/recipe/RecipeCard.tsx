import { Link } from "@tanstack/react-router";
import { Clock, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Receita } from "@/types";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { DIFICULDADE_LABEL } from "@/constants";
import { formatTempo } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RecipeCard({ receita, index = 0 }: { receita: Receita; index?: number }) {
  const [fav, setFav] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
      className="group card-elevated card-elevated-hover relative overflow-hidden"
    >
      <Link
        to="/receita/$id"
        params={{ id: String(receita.id) }}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <ImageWithFallback
            src={receita.imagem}
            alt={receita.nome}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          {receita.categoria?.nome ? (
            <Badge className="absolute left-3 top-3 rounded-full border-0 bg-white/85 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
              {receita.categoria.nome}
            </Badge>
          ) : null}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg leading-tight text-foreground line-clamp-2">
              {receita.nome}
            </h3>
          </div>
          {receita.descricao ? (
            <p className="text-sm text-muted-foreground line-clamp-2">{receita.descricao}</p>
          ) : null}
          <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatTempo(receita.tempoPreparo)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {receita.porcoes} porç.
            </span>
            <span className="ml-auto rounded-full bg-secondary px-2 py-0.5">
              {DIFICULDADE_LABEL[receita.dificuldade]}
            </span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-label={fav ? "Remover dos favoritos" : "Favoritar receita"}
        onClick={(e) => {
          e.preventDefault();
          setFav((v) => !v);
        }}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-foreground shadow-soft backdrop-blur transition hover:bg-white"
      >
        <Heart
          className={cn("h-4 w-4 transition", fav && "fill-primary text-primary")}
        />
      </button>
    </motion.article>
  );
}
