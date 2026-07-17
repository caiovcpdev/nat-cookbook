import { Dificuldade } from "@/types";

export const STORAGE_KEYS = {
  token: "receitas:token",
  tokenExp: "receitas:token_exp",
} as const;

export const DIFICULDADE_LABEL: Record<Dificuldade, string> = {
  [Dificuldade.Facil]: "Fácil",
  [Dificuldade.Medio]: "Médio",
  [Dificuldade.Dificil]: "Difícil",
};

export const DIFICULDADE_OPTIONS = [
  { value: Dificuldade.Facil, label: "Fácil" },
  { value: Dificuldade.Medio, label: "Médio" },
  { value: Dificuldade.Dificil, label: "Difícil" },
];

export const QUERY_KEYS = {
  receitas: ["receitas"] as const,
  receita: (id: number | string) => ["receitas", String(id)] as const,
  categorias: ["categorias"] as const,
  perfil: ["perfil"] as const,
};
