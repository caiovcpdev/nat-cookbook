import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Loader2, ChefHat } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().trim().email("Email inválido"),
  senha: z.string().min(4, "Informe sua senha"),
});
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Entrar — Colher & Casa" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", senha: "" },
  });

  useEffect(() => {
    if (isAuthenticated) navigate({ to: redirect || "/", replace: true });
  }, [isAuthenticated, navigate, redirect]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await login(values);
      toast.success("Bem-vinda de volta!");
      navigate({ to: redirect || "/", replace: true });
    } catch (err) {
      toast.error((err as ApiError).message ?? "Não foi possível entrar.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="grid min-h-screen bg-background sm:grid-cols-2">
      <div className="hidden gradient-warm sm:flex sm:flex-col sm:justify-between sm:p-10">
        <Link to="/" className="inline-flex items-center gap-2 text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-primary">
            <ChefHat className="h-5 w-5" />
          </span>
          <span className="font-display text-lg">Colher &amp; Casa</span>
        </Link>
        <div>
          <h2 className="font-display text-3xl leading-tight text-foreground">
            Sua cozinha, agora <br /> em um lugar só.
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Organize receitas, ingredientes e memórias. Tudo com um toque
            delicado e feito para durar.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-6 sm:p-10"
      >
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-foreground sm:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-primary">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="font-display text-lg">Colher &amp; Casa</span>
          </Link>
          <h1 className="font-display text-2xl text-foreground">Entrar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse seu livro de receitas pessoal.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>Senha</Label>
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...form.register("senha")}
              />
              {form.formState.errors.senha ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.senha.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full shadow-primary"
              size="lg"
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-medium text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
