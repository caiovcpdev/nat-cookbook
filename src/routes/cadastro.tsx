import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, ChefHat } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import type { ApiError } from "@/lib/api";

const schema = z.object({
  nome: z.string().trim().min(2, "Como podemos te chamar?").max(120),
  email: z.string().trim().email("Email inválido"),
  senha: z.string().min(6, "A senha precisa de ao menos 6 caracteres"),
});
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta — Colher & Casa" }] }),
  component: CadastroPage,
});

function CadastroPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "", senha: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await authService.cadastrar(values);
      toast.success("Conta criada! Faça login para continuar.");
      navigate({ to: "/login", replace: true });
    } catch (err) {
      toast.error((err as ApiError).message ?? "Não foi possível criar a conta.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-primary">
            <ChefHat className="h-5 w-5" />
          </span>
          <span className="font-display text-lg">Colher &amp; Casa</span>
        </Link>
        <div className="card-elevated p-6 sm:p-8">
          <h1 className="font-display text-2xl text-foreground">Criar conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Comece a organizar suas receitas em poucos segundos.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Nome" error={form.formState.errors.nome?.message}>
              <Input placeholder="Como podemos te chamar?" {...form.register("nome")} />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <Input type="email" placeholder="voce@email.com" {...form.register("email")} />
            </Field>
            <Field label="Senha" error={form.formState.errors.senha?.message}>
              <Input type="password" placeholder="Mínimo 6 caracteres" {...form.register("senha")} />
            </Field>
            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full rounded-full shadow-primary"
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Criar minha conta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
