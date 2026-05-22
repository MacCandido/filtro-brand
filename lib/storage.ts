// Persistência local de demandas filtradas.
// Provisório em localStorage. Quando o Supabase entrar, migra para lá.

import { Estado, Diagnostico } from "./logic";

export interface DemandaSalva {
  id: string;
  criadoEm: string;
  atualizadoEm: string;
  nome: string;
  solicitante: string;
  descricao: string;
  estado: Estado;
  diagnostico: Diagnostico;
}

const CHAVE = "filtro-brand:demandas";

export function listarDemandas(): DemandaSalva[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CHAVE);
    if (!raw) return [];
    const lista = JSON.parse(raw) as DemandaSalva[];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function salvarDemanda(
  demanda: Omit<DemandaSalva, "id" | "criadoEm" | "atualizadoEm">,
  idExistente?: string
): DemandaSalva {
  const agora = new Date().toISOString();
  const lista = listarDemandas();

  if (idExistente) {
    const idx = lista.findIndex((d) => d.id === idExistente);
    if (idx >= 0) {
      const atualizada: DemandaSalva = {
        ...lista[idx],
        ...demanda,
        atualizadoEm: agora,
      };
      lista[idx] = atualizada;
      persist(lista);
      return atualizada;
    }
  }

  const nova: DemandaSalva = {
    ...demanda,
    id: gerarId(),
    criadoEm: agora,
    atualizadoEm: agora,
  };
  lista.unshift(nova);
  persist(lista);
  return nova;
}

export function carregarDemanda(id: string): DemandaSalva | null {
  return listarDemandas().find((d) => d.id === id) ?? null;
}

export function removerDemanda(id: string): void {
  const lista = listarDemandas().filter((d) => d.id !== id);
  persist(lista);
}

function persist(lista: DemandaSalva[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHAVE, JSON.stringify(lista));
}

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function baixarComoJson(demanda: DemandaSalva) {
  const blob = new Blob([JSON.stringify(demanda, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const nomeArquivo = (demanda.nome || "demanda")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  a.download = `${nomeArquivo || "demanda"}-${demanda.id.slice(0, 8)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
