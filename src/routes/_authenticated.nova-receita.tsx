import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/forms/RecipeForm";
import { useCategorias } from "@/hooks/useCategorias";
import { useCreateReceita } from "@/hooks/useReceitas";

export const Route = createFileRoute("/_authenticated/nova-receita")({
  head: () => ({ meta: [{ title: "Nova receita — Colher & Casa" }] }),
  component: NovaReceitaPage,
});

function NovaReceitaPage() {
  const navigate = useNavigate();
  const categorias = useCategorias();
  const create = useCreateReceita();

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
          <h1 className="font-display text-3xl text-foreground">Nova receita</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preencha os detalhes com calma. Você pode editar depois.
          </p>
        </header>

        <RecipeForm
          categorias={categorias.data ?? []}
          loading={create.isPending}
          submitLabel="Publicar receita"
          onSubmit={async (values) => {
            try {
              const created = await create.mutateAsync(values);
              toast.success("Receita criada com sucesso!");
              navigate({ to: "/receita/$id", params: { id: String(created.id) } });
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        />
      </PageContainer>
    </AppShell>
  );
}
