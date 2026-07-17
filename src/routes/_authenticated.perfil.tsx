import { createFileRoute } from "@tanstack/react-router";
import { Mail, Calendar, LogOut } from "lucide-react";
import { motion } from "framer-motion";

import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/common/PageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate, initials } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Colher & Casa" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const { user, isLoadingProfile, logout } = useAuth();

  return (
    <AppShell>
      <PageContainer>
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated overflow-hidden"
        >
          <div className="gradient-primary h-32" />
          <div className="-mt-14 px-6 pb-6 sm:px-8">
            <Avatar className="h-24 w-24 border-4 border-card shadow-elevated">
              <AvatarImage src={user?.foto ?? undefined} alt={user?.nome ?? ""} />
              <AvatarFallback className="bg-primary-soft text-2xl text-primary">
                {initials(user?.nome)}
              </AvatarFallback>
            </Avatar>

            <div className="mt-4">
              {isLoadingProfile && !user ? (
                <>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="mt-2 h-4 w-64" />
                </>
              ) : (
                <>
                  <h1 className="font-display text-2xl text-foreground sm:text-3xl">
                    {user?.nome ?? "Sua conta"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Aqui você acompanha seus dados e a coleção de receitas.
                  </p>
                </>
              )}
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoRow icon={Mail} label="Email" value={user?.email} />
              <InfoRow
                icon={Calendar}
                label="Membro desde"
                value={formatDate(user?.dataCadastro) || "—"}
              />
            </dl>

            <div className="mt-8">
              <Button
                variant="outline"
                onClick={logout}
                className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair da conta
              </Button>
            </div>
          </div>
        </motion.section>
      </PageContainer>
    </AppShell>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate text-sm font-medium text-foreground">{value || "—"}</dd>
      </div>
    </div>
  );
}
