import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/forms/RecipeForm";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategorias } from "@/hooks/useCategorias";
import { useReceita, useUpdateReceita } from "@/hooks/useReceitas";

export const Route = createFileRoute("/_authenticated/editar-receita/$id")({
  head: () => ({ meta: [{ title: "Editar receita — Colher & Casa" }] }),
  component: EditarReceitaPage,
});

function EditarReceitaPage() {
  const { id } = Route.useParams();
  const numericId = Number(id);
  const navigate = useNavigate();
  const categorias = useCategorias();
  const receita = useReceita(id);
  const update = useUpdateReceita(numericId);

  return (
    <AppShell>
      <PageContainer>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 rounded-full text-muted-foreground"
        >
          <Link to="/minhas-receitas">
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Link>
        </Button>

        <header className="mb-6">
          <h1 className="font-display text-3xl text-foreground">Editar receita</h1>
        </header>

        {receita.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
        ) : receita.isError || !receita.data ? (
          <ErrorState onRetry={() => receita.refetch()} />
        ) : (
          <RecipeForm
            categorias={categorias.data ?? []}
            initial={receita.data}
            loading={update.isPending}
            submitLabel="Salvar alterações"
            onSubmit={async (values) => {
              try {
                await update.mutateAsync(values);
                toast.success("Receita atualizada!");
                navigate({ to: "/receita/$id", params: { id } });
              } catch (e) {
                toast.error((e as Error).message);
              }
            }}
          />
        )}
      </PageContainer>
    </AppShell>
  );
}
