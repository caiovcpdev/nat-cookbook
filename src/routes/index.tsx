import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles, Plus } from "lucide-react";
import { motion } from "framer-motion";

import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionTitle } from "@/components/common/SectionTitle";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { CategoryChips } from "@/components/recipe/CategoryChips";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useReceitas } from "@/hooks/useReceitas";
import { useCategorias } from "@/hooks/useCategorias";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Colher & Casa — Receitas de família" },
      {
        name: "description",
        content:
          "Descubra e organize receitas com um visual elegante, feito para o dia a dia da cozinha.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const debouncedQuery = useDebounce(query, 200);

  const receitas = useReceitas();
  const categorias = useCategorias();

  const filtered = useMemo(() => {
    const list = receitas.data ?? [];
    return list.filter((r) => {
      const matchesQuery = debouncedQuery
        ? r.nome.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          r.descricao?.toLowerCase().includes(debouncedQuery.toLowerCase())
        : true;
      const matchesCat = categoriaId ? r.categoriaId === categoriaId : true;
      return matchesQuery && matchesCat;
    });
  }, [receitas.data, debouncedQuery, categoriaId]);

  return (
    <AppShell>
      <section className="gradient-warm border-b border-border/60">
        <PageContainer className="py-10 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary shadow-soft backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Seu livro de receitas
            </div>
            <h1 className="font-display text-3xl leading-tight text-foreground sm:text-5xl">
              Receitas que{" "}
              <span className="text-primary">contam histórias</span>.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Um espaço tranquilo para guardar cada preparo, cada ingrediente e
              cada memória de cozinha.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nome ou descrição..."
                  className="h-12 rounded-full border-transparent bg-white pl-11 shadow-soft focus-visible:border-primary/40"
                />
              </div>
              {isAuthenticated ? (
                <Button asChild size="lg" className="hidden rounded-full shadow-primary sm:inline-flex">
                  <Link to="/nova-receita">
                    <Plus className="mr-1 h-4 w-4" /> Nova
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="hidden rounded-full shadow-primary sm:inline-flex">
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
              )}
            </div>
          </motion.div>
        </PageContainer>
      </section>

      <PageContainer>
        <div className="mb-6">
          <SectionTitle>Categorias</SectionTitle>
          {categorias.isLoading ? (
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-muted"
                />
              ))}
            </div>
          ) : categorias.data && categorias.data.length ? (
            <CategoryChips
              categorias={categorias.data}
              selected={categoriaId}
              onSelect={setCategoriaId}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Ainda não há categorias cadastradas.
            </p>
          )}
        </div>

        <SectionTitle
          action={
            receitas.data ? (
              <span className="text-sm text-muted-foreground">
                {filtered.length} de {receitas.data.length}
              </span>
            ) : null
          }
        >
          Receitas
        </SectionTitle>

        {receitas.isLoading ? (
          <RecipeGrid>
            {Array.from({ length: 8 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </RecipeGrid>
        ) : receitas.isError ? (
          <ErrorState
            description="Não foi possível carregar as receitas. Verifique se a API está acessível."
            onRetry={() => receitas.refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title={query ? "Nada encontrado" : "Sem receitas ainda"}
            description={
              query
                ? "Tente buscar por outro nome ou limpar os filtros."
                : "Assim que houver receitas cadastradas, elas aparecerão aqui."
            }
            action={
              isAuthenticated ? (
                <Button asChild className="rounded-full">
                  <Link to="/nova-receita">Criar primeira receita</Link>
                </Button>
              ) : null
            }
          />
        ) : (
          <RecipeGrid>
            {filtered.map((r, i) => (
              <RecipeCard key={r.id} receita={r} index={i} />
            ))}
          </RecipeGrid>
        )}
      </PageContainer>
    </AppShell>
  );
}
