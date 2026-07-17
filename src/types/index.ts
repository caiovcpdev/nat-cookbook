// ============================================================================
// Domain types — mirror the DTOs returned by the .NET API.
// Keep these platform-agnostic so they can be reused in a future React Native
// client without changes.
// ============================================================================

export enum Dificuldade {
  Facil = 0,
  Medio = 1,
  Dificil = 2,
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string | null;
}

export interface Ingrediente {
  id?: number;
  nome: string;
  quantidade?: string;
}

export interface Passo {
  id?: number;
  ordem?: number;
  descricao: string;
}

export interface Receita {
  id: number;
  categoriaId: number;
  categoria?: Categoria | null;
  nome: string;
  descricao: string;
  tempoPreparo: number; // minutos
  porcoes: number;
  dificuldade: Dificuldade;
  imagem?: string | null;
  ingredientes: Ingrediente[];
  passos: Passo[];
  criadoEm?: string;
  usuarioId?: number;
}

export interface ReceitaInput {
  categoriaId: number;
  nome: string;
  descricao: string;
  tempoPreparo: number;
  porcoes: number;
  dificuldade: Dificuldade;
  imagem?: string;
  ingredientes: Ingrediente[];
  passos: Passo[];
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  foto?: string | null;
  dataCadastro?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  expiraEm: string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface CategoriaInput {
  nome: string;
  descricao?: string;
}
