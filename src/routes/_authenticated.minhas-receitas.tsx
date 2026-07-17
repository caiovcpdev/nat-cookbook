import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionTitle } from "@/components/common/SectionTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useReceitas, useDeleteReceita } from "@/hooks/useReceitas";
import { formatTempo } from "@/utils/format";
import { DIFICULDADE_LABEL } from "@/constants";
import type { Receita } from "@/types";

export const Route = createFileRoute("/_authenticated/minhas-receitas")({
  head: () => ({ meta: [{ title: "Minhas receitas — Colher & Casa" }] }),
  component: MinhasReceitasPage,
});

function MinhasReceitasPage() {
  const query = useReceitas();
  const del = useDeleteReceita();
  const [toDelete, setToDelete] = useState<Receita | null>(null);

  return (
    <AppShell>
      <PageContainer>
        <SectionTitle
          action={
            <Button asChild className="rounded-full shadow-primary">
              <Link to="/nova-receita">
                <Plus className="mr-1 h-4 w-4" /> Nova receita
              </Link>
            </Button>
          }
        >
          Minhas receitas
        </SectionTitle>

        {query.isLoading ? (
          <RecipeGrid>
            {Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
          </RecipeGrid>
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : !query.data || query.data.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nenhuma receita ainda"
            description="Comece agora — em poucos minutos você terá seu livro digital."
            action={
              <Button asChild className="rounded-full">
                <Link to="/nova-receita">Criar primeira receita</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.map((r) => (
              <article
                key={r.id}
                className="card-elevated card-elevated-hover overflow-hidden"
              >
                <Link
                  to="/receita/$id"
                  params={{ id: String(r.id) }}
                  className="block"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <ImageWithFallback src={r.imagem} alt={r.nome} />
                  </div>
                </Link>
                <div className="space-y-2 p-4">
                  <div className="flex items-center gap-2">
                    {r.categoria?.nome ? (
                      <Badge className="rounded-full bg-secondary text-foreground hover:bg-secondary">
                        {r.categoria.nome}
                      </Badge>
                    ) : null}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatTempo(r.tempoPreparo)} · {DIFICULDADE_LABEL[r.dificuldade]}
                    </span>
                  </div>
                  <h3 className="font-display text-lg line-clamp-1">{r.nome}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {r.descricao}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 rounded-full">
                      <Link
                        to="/editar-receita/$id"
                        params={{ id: String(r.id) }}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" /> Editar
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setToDelete(r)}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </PageContainer>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title={`Excluir "${toDelete?.nome ?? "receita"}"?`}
        description="Essa ação não pode ser desfeita. Todos os ingredientes e passos serão removidos."
        confirmLabel="Excluir"
        destructive
        loading={del.isPending}
        onConfirm={async () => {
          if (!toDelete) return;
          try {
            await del.mutateAsync(toDelete.id);
            toast.success("Receita excluída.");
            setToDelete(null);
          } catch (e) {
            toast.error((e as Error).message);
          }
        }}
      />
    </AppShell>
  );
}
