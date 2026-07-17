import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Plus, FolderHeart, User, type LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: LucideIcon; highlight?: boolean };

const guestItems: NavItem[] = [
  { to: "/", label: "Início", icon: Home },
  { to: "/login", label: "Entrar", icon: User },
];

const authItems: NavItem[] = [
  { to: "/", label: "Início", icon: Home },
  { to: "/minhas-receitas", label: "Minhas", icon: BookOpen },
  { to: "/nova-receita", label: "Nova", icon: Plus, highlight: true },
  { to: "/categorias", label: "Categorias", icon: FolderHeart },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const { isAuthenticated } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items = isAuthenticated ? authItems : guestItems;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 pb-safe backdrop-blur sm:hidden"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-1">
        {items.map((item) => {
          const active =
            item.to === "/" ? path === "/" : path.startsWith(item.to);
          const Icon = item.icon;
          if (item.highlight) {
            return (
              <li key={item.to} className="-mt-6 flex justify-center">
                <Link
                  to={item.to}
                  aria-label={item.label}
                  className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-primary transition active:scale-95"
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            );
          }
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium transition",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
