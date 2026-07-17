import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FolderHeart, Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/common/PageContainer";
import { SectionTitle } from "@/components/common/SectionTitle";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCategorias,
  useCreateCategoria,
  useUpdateCategoria,
  useDeleteCategoria,
} from "@/hooks/useCategorias";
import type { Categoria } from "@/types";

const schema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(80),
  descricao: z.string().trim().max(200).optional().or(z.literal("")),
});
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/_authenticated/categorias")({
  head: () => ({ meta: [{ title: "Categorias — Colher & Casa" }] }),
  component: CategoriasPage,
});

function CategoriasPage() {
  const query = useCategorias();
  const create = useCreateCategoria();
  const update = useUpdateCategoria();
  const del = useDeleteCategoria();

  const [editing, setEditing] = useState<Categoria | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Categoria | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (c: Categoria) => {
    setEditing(c);
    setDialogOpen(true);
  };

  return (
    <AppShell>
      <PageContainer>
        <SectionTitle
          action={
            <Button className="rounded-full shadow-primary" onClick={openCreate}>
              <Plus className="mr-1 h-4 w-4" /> Nova
            </Button>
          }
        >
          Categorias
        </SectionTitle>

        {query.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-3xl" />
            ))}
          </div>
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : !query.data || query.data.length === 0 ? (
          <EmptyState
            icon={FolderHeart}
            title="Sem categorias"
            description="Categorias ajudam a organizar suas receitas por tema."
            action={
              <Button className="rounded-full" onClick={openCreate}>
                Criar primeira categoria
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {query.data.map((c) => (
                <motion.article
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="card-elevated flex items-start justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                        <FolderHeart className="h-4 w-4" />
                      </span>
                      <h3 className="truncate font-display text-lg">{c.nome}</h3>
                    </div>
                    {c.descricao ? (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {c.descricao}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Editar"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Excluir"
                      onClick={() => setToDelete(c)}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>

      <CategoriaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        submitting={create.isPending || update.isPending}
        onSubmit={async (values) => {
          try {
            if (editing) {
              await update.mutateAsync({
                id: editing.id,
                input: { nome: values.nome, descricao: values.descricao || undefined },
              });
              toast.success("Categoria atualizada.");
            } else {
              await create.mutateAsync({
                nome: values.nome,
                descricao: values.descricao || undefined,
              });
              toast.success("Categoria criada.");
            }
            setDialogOpen(false);
          } catch (e) {
            toast.error((e as Error).message);
          }
        }}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title={`Excluir "${toDelete?.nome ?? ""}"?`}
        description="As receitas dessa categoria ficarão sem categoria."
        confirmLabel="Excluir"
        destructive
        loading={del.isPending}
        onConfirm={async () => {
          if (!toDelete) return;
          try {
            await del.mutateAsync(toDelete.id);
            toast.success("Categoria excluída.");
            setToDelete(null);
          } catch (e) {
            toast.error((e as Error).message);
          }
        }}
      />
    </AppShell>
  );
}

function CategoriaDialog({
  open,
  onOpenChange,
  initial,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Categoria | null;
  submitting?: boolean;
  onSubmit: (values: Values) => Promise<void> | void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      nome: initial?.nome ?? "",
      descricao: initial?.descricao ?? "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {initial ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          id="categoria-form"
        >
          <div className="space-y-1.5">
            <Label>Nome</Label>
            <Input placeholder="Ex.: Sobremesas" {...form.register("nome")} />
            {form.formState.errors.nome ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.nome.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label>Descrição (opcional)</Label>
            <Input placeholder="Sobre a categoria" {...form.register("descricao")} />
          </div>
        </form>
        <DialogFooter>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="categoria-form"
            className="rounded-full"
            disabled={submitting}
          >
            {submitting ? "Salvando..." : initial ? "Salvar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
