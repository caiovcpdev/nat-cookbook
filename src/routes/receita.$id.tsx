import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Users, ChefHat, Share2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/common/PageContainer";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useReceita } from "@/hooks/useReceitas";
import { DIFICULDADE_LABEL } from "@/constants";
import { formatTempo } from "@/utils/format";

export const Route = createFileRoute("/receita/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Receita #${params.id} — Colher & Casa` }],
  }),
  component: RecipeDetail,
});

function RecipeDetail() {
  const { id } = Route.useParams();
  const query = useReceita(id);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [fav, setFav] = useState(false);

  const receita = query.data;

  return (
    <AppShell>
      <PageContainer>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 rounded-full text-muted-foreground"
        >
          <Link to="/">
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Link>
        </Button>

        {query.isLoading ? (
          <div className="space-y-6">
            <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : query.isError || !receita ? (
          <ErrorState
            description="Receita indisponível. Verifique a conexão com a API."
            onRetry={() => query.refetch()}
          />
        ) : (
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="relative overflow-hidden rounded-3xl bg-muted shadow-elevated">
              <div className="aspect-[16/9] w-full">
                <ImageWithFallback src={receita.imagem} alt={receita.nome} />
              </div>
              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setFav((v) => !v)}
                  aria-label="Favoritar"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-soft backdrop-blur transition hover:bg-white"
                >
                  <Heart className={fav ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5"} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.share) {
                      navigator
                        .share({ title: receita.nome, text: receita.descricao })
                        .catch(() => undefined);
                    } else {
                      toast("Compartilhamento em breve");
                    }
                  }}
                  aria-label="Compartilhar"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-soft backdrop-blur transition hover:bg-white"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <header className="space-y-3">
              {receita.categoria?.nome ? (
                <Badge className="rounded-full bg-primary-soft text-primary hover:bg-primary-soft">
                  {receita.categoria.nome}
                </Badge>
              ) : null}
              <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
                {receita.nome}
              </h1>
              <p className="max-w-2xl text-muted-foreground">{receita.descricao}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Stat icon={Clock} label="Tempo" value={formatTempo(receita.tempoPreparo)} />
                <Stat icon={Users} label="Porções" value={String(receita.porcoes)} />
                <Stat icon={ChefHat} label="Dificuldade" value={DIFICULDADE_LABEL[receita.dificuldade]} />
              </div>
            </header>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
              <section className="card-elevated p-6">
                <h2 className="mb-4 font-display text-xl">Ingredientes</h2>
                <ul className="space-y-2.5">
                  {receita.ingredientes.map((i, idx) => {
                    const key = `${idx}-${i.nome}`;
                    return (
                      <li
                        key={key}
                        className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition hover:bg-secondary"
                      >
                        <Checkbox
                          id={key}
                          checked={!!checked[key]}
                          onCheckedChange={(v) =>
                            setChecked((c) => ({ ...c, [key]: !!v }))
                          }
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={key}
                          className={
                            "flex-1 cursor-pointer text-sm " +
                            (checked[key] ? "text-muted-foreground line-through" : "")
                          }
                        >
                          <span className="font-medium text-foreground">{i.nome}</span>
                          {i.quantidade ? (
                            <span className="ml-2 text-muted-foreground">— {i.quantidade}</span>
                          ) : null}
                        </label>
                      </li>
                    );
                  })}
                  {receita.ingredientes.length === 0 ? (
                    <li className="text-sm text-muted-foreground">Nenhum ingrediente listado.</li>
                  ) : null}
                </ul>
              </section>

              <section>
                <h2 className="mb-4 font-display text-xl">Modo de preparo</h2>
                <ol className="space-y-4">
                  {[...receita.passos]
                    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                    .map((p, idx) => (
                      <motion.li
                        key={p.id ?? idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="card-elevated flex gap-4 p-4"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {idx + 1}
                        </span>
                        <p className="flex-1 pt-1 text-sm leading-relaxed text-foreground">
                          {p.descricao}
                        </p>
                      </motion.li>
                    ))}
                  {receita.passos.length === 0 ? (
                    <li className="text-sm text-muted-foreground">
                      Nenhum passo cadastrado.
                    </li>
                  ) : null}
                </ol>
              </section>
            </div>
          </motion.article>
        )}
      </PageContainer>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2">
      <Icon className="h-4 w-4 text-primary" />
      <div className="text-xs leading-tight">
        <div className="text-muted-foreground">{label}</div>
        <div className="font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}