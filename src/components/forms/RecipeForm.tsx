import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DIFICULDADE_OPTIONS } from "@/constants";
import { Dificuldade, type Categoria, type ReceitaInput } from "@/types";

const schema = z.object({
  nome: z.string().trim().min(2, "Dê um nome à receita").max(120),
  descricao: z.string().trim().min(4, "Adicione uma breve descrição").max(500),
  categoriaId: z.coerce.number().int().min(1, "Selecione uma categoria"),
  tempoPreparo: z.coerce.number().int().min(1, "Tempo em minutos").max(24 * 60),
  porcoes: z.coerce.number().int().min(1).max(200),
  dificuldade: z.coerce.number().int().min(0).max(2),
  imagem: z
    .string()
    .trim()
    .max(2048)
    .url("URL da imagem inválida")
    .optional()
    .or(z.literal("")),
  ingredientes: z
    .array(
      z.object({
        nome: z.string().trim().min(1, "Ingrediente vazio"),
        quantidade: z.string().trim().max(80).optional().or(z.literal("")),
      }),
    )
    .min(1, "Adicione ao menos um ingrediente"),
  passos: z
    .array(z.object({ descricao: z.string().trim().min(2, "Passo vazio") }))
    .min(1, "Adicione ao menos um passo"),
});

export type RecipeFormValues = z.infer<typeof schema>;

interface Props {
  categorias: Categoria[];
  initial?: Partial<ReceitaInput>;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (values: ReceitaInput) => void | Promise<void>;
}

export function RecipeForm({
  categorias,
  initial,
  submitLabel = "Salvar receita",
  loading,
  onSubmit,
}: Props) {
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: initial?.nome ?? "",
      descricao: initial?.descricao ?? "",
      categoriaId: initial?.categoriaId ?? 0,
      tempoPreparo: initial?.tempoPreparo ?? 30,
      porcoes: initial?.porcoes ?? 2,
      dificuldade: initial?.dificuldade ?? Dificuldade.Facil,
      imagem: initial?.imagem ?? "",
      ingredientes:
        initial?.ingredientes && initial.ingredientes.length
          ? initial.ingredientes.map((i) => ({ nome: i.nome, quantidade: i.quantidade ?? "" }))
          : [{ nome: "", quantidade: "" }],
      passos:
        initial?.passos && initial.passos.length
          ? initial.passos.map((p) => ({ descricao: p.descricao }))
          : [{ descricao: "" }],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const ingredientes = useFieldArray({ control, name: "ingredientes" });
  const passos = useFieldArray({ control, name: "passos" });

  const submit = handleSubmit((values) => {
    const payload: ReceitaInput = {
      ...values,
      imagem: values.imagem || undefined,
      ingredientes: values.ingredientes.map((i) => ({
        nome: i.nome,
        quantidade: i.quantidade || undefined,
      })),
      passos: values.passos.map((p, idx) => ({ descricao: p.descricao, ordem: idx + 1 })),
    };
    return onSubmit(payload);
  });

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="card-elevated space-y-5 p-5 sm:p-6">
        <h3 className="font-display text-lg">Sobre a receita</h3>

        <Field label="Nome" error={errors.nome?.message}>
          <Input placeholder="Ex.: Bolo de laranja" {...register("nome")} />
        </Field>

        <Field label="Descrição" error={errors.descricao?.message}>
          <Textarea
            rows={3}
            placeholder="Conte em poucas palavras o que torna essa receita especial."
            {...register("descricao")}
          />
        </Field>

        <Field label="URL da imagem" error={errors.imagem?.message} hint="Opcional">
          <Input placeholder="https://..." {...register("imagem")} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Categoria" error={errors.categoriaId?.message}>
            <Controller
              control={control}
              name="categoriaId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Dificuldade">
            <Controller
              control={control}
              name="dificuldade"
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFICULDADE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Tempo (min)" error={errors.tempoPreparo?.message}>
            <Input type="number" inputMode="numeric" min={1} {...register("tempoPreparo")} />
          </Field>
          <Field label="Porções" error={errors.porcoes?.message}>
            <Input type="number" inputMode="numeric" min={1} {...register("porcoes")} />
          </Field>
        </div>
      </section>

      <section className="card-elevated space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">Ingredientes</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full text-primary"
            onClick={() => ingredientes.append({ nome: "", quantidade: "" })}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar
          </Button>
        </div>
        <AnimatePresence initial={false}>
          {ingredientes.fields.map((f, idx) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="grid grid-cols-[1fr_auto] items-start gap-2 sm:grid-cols-[2fr_1fr_auto]"
            >
              <Input
                placeholder="Ingrediente"
                {...register(`ingredientes.${idx}.nome` as const)}
              />
              <Input
                placeholder="Qtd. (opcional)"
                className="hidden sm:block"
                {...register(`ingredientes.${idx}.quantidade` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remover ingrediente"
                onClick={() => ingredientes.remove(idx)}
                disabled={ingredientes.fields.length === 1}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Qtd. (opcional)"
                className="col-span-2 sm:hidden"
                {...register(`ingredientes.${idx}.quantidade` as const)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {errors.ingredientes?.message ? (
          <p className="text-xs text-destructive">{errors.ingredientes.message}</p>
        ) : null}
      </section>

      <section className="card-elevated space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">Modo de preparo</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full text-primary"
            onClick={() => passos.append({ descricao: "" })}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar passo
          </Button>
        </div>
        <AnimatePresence initial={false}>
          {passos.fields.map((f, idx) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-start gap-3"
            >
              <span className="mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                {idx + 1}
              </span>
              <Textarea
                rows={2}
                placeholder={`Descreva o passo ${idx + 1}`}
                className="flex-1"
                {...register(`passos.${idx}.descricao` as const)}
              />
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Mover para cima"
                  disabled={idx === 0}
                  onClick={() => passos.move(idx, idx - 1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Mover para baixo"
                  disabled={idx === passos.fields.length - 1}
                  onClick={() => passos.move(idx, idx + 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remover passo"
                  disabled={passos.fields.length === 1}
                  onClick={() => passos.remove(idx)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {errors.passos?.message ? (
          <p className="text-xs text-destructive">{errors.passos.message}</p>
        ) : null}
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="rounded-full px-8 shadow-primary"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label className="text-sm text-foreground">{label}</Label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
