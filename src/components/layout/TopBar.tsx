import { Link, useRouterState } from "@tanstack/react-router";
import { ChefHat, LogIn, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/utils/format";

export function TopBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-primary">
            <ChefHat className="h-5 w-5" />
          </span>
          <span className="font-display text-lg tracking-tight sm:text-xl">Livro Receitas da Nat</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          <NavLink to="/" active={path === "/"}>Descobrir</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/minhas-receitas" active={path.startsWith("/minhas-receitas")}>
                Minhas
              </NavLink>
              <NavLink to="/categorias" active={path.startsWith("/categorias")}>
                Categorias
              </NavLink>
            </>
          ) : null}
        </nav>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto sm:ml-2 outline-none">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user?.foto ?? undefined} alt={user?.nome ?? "Perfil"} />
                <AvatarFallback className="bg-primary-soft text-primary">
                  {initials(user?.nome)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl">
              <DropdownMenuLabel className="truncate">
                {user?.nome ?? "Minha conta"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/perfil"><User className="mr-2 h-4 w-4" /> Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/minhas-receitas">Minhas receitas</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/categorias">Categorias</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/login">
                <LogIn className="mr-1 h-4 w-4" /> Entrar
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-full shadow-primary">
              <Link to="/cadastro">Criar conta</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={
        "rounded-full px-4 py-2 text-sm font-medium transition " +
        (active
          ? "bg-primary-soft text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground")
      }
    >
      {children}
    </Link>
  );
}
