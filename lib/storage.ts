// Persistência local e geração de PDF de demandas filtradas.
// Provisório em localStorage. Quando o Supabase entrar, migra para lá.

import { Estado, Diagnostico, vereditoLabel } from "./logic";
import { GATES, SCORES } from "./criteria";

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

export async function baixarComoPdf(demanda: DemandaSalva) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Util: escreve texto multilinha com auto-wrap
  function texto(
    str: string,
    opt: {
      size?: number;
      font?: "helvetica" | "times" | "courier";
      style?: "normal" | "bold" | "italic";
      cor?: [number, number, number];
      gapAfter?: number;
      indent?: number;
    } = {}
  ) {
    const size = opt.size ?? 10;
    const font = opt.font ?? "helvetica";
    const style = opt.style ?? "normal";
    const cor = opt.cor ?? [10, 10, 10];
    const gapAfter = opt.gapAfter ?? 2;
    const indent = opt.indent ?? 0;
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(cor[0], cor[1], cor[2]);
    const linhas = doc.splitTextToSize(str, contentW - indent);
    if (y + linhas.length * size * 0.4 > 285) {
      doc.addPage();
      y = margin;
    }
    doc.text(linhas, margin + indent, y);
    y += linhas.length * size * 0.4 + gapAfter;
  }

  function linha(cor: [number, number, number] = [200, 200, 200]) {
    doc.setDrawColor(cor[0], cor[1], cor[2]);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageW - margin, y);
    y += 4;
  }

  function caixaVeredito(label: string, score: number, scoreMax: number) {
    const corBg = corPorVeredito(demanda.diagnostico.veredito);
    const altura = 30;
    if (y + altura > 285) {
      doc.addPage();
      y = margin;
    }
    doc.setFillColor(corBg[0], corBg[1], corBg[2]);
    doc.rect(margin, y, contentW, altura, "F");

    const corTxt: [number, number, number] =
      demanda.diagnostico.veredito === "avaliacao" ||
      demanda.diagnostico.veredito === "pendente"
        ? [10, 10, 10]
        : [245, 242, 236];

    doc.setTextColor(corTxt[0], corTxt[1], corTxt[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("VEREDITO", margin + 4, y + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(label.toUpperCase(), margin + 4, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`SCORE  ${score} / ${scoreMax}`, margin + 4, y + 25);
    y += altura + 6;
  }

  // === CABEÇALHO ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(107, 107, 107);
  doc.text("DECISION TREE · BRAND & MKT TÁTIL", margin, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(10, 10, 10);
  doc.text(
    (demanda.nome || "Sem nome").toUpperCase(),
    margin,
    y
  );
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 107, 107);
  doc.text(
    `${demanda.solicitante || "Sem solicitante"}  ·  ${formatarData(demanda.atualizadoEm)}`,
    margin,
    y
  );
  y += 8;

  if (demanda.descricao) {
    texto(demanda.descricao, { size: 9, cor: [60, 60, 60], gapAfter: 6 });
  }

  linha();

  // === VEREDITO ===
  caixaVeredito(
    vereditoLabel(demanda.diagnostico.veredito),
    demanda.diagnostico.scoreTotal,
    demanda.diagnostico.scoreMaximo
  );

  // === FILTROS ELIMINATÓRIOS ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(107, 107, 107);
  doc.text("FILTROS ELIMINATÓRIOS", margin, y);
  y += 5;

  GATES.forEach((g) => {
    const resp = demanda.estado.gates[g.id];
    const opcao = g.opcoes.find((o) => o.valor === resp);
    texto(g.titulo, { size: 10, style: "bold", gapAfter: 1 });
    texto(opcao?.label ?? "— não respondido", {
      size: 9,
      cor: [60, 60, 60],
      gapAfter: 4,
    });
  });

  y += 2;
  linha();

  // === SCORE ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(107, 107, 107);
  doc.text("SCORE ESTRATÉGICO", margin, y);
  y += 5;

  SCORES.forEach((s) => {
    const v = demanda.estado.scores[s.id];
    texto(`${s.titulo}  ·  ${v ?? "—"} de 2`, {
      size: 10,
      style: "bold",
      gapAfter: 1,
    });
    if (v !== null && v !== undefined) {
      const explic = s.explicacao.porValor[v as 0 | 1 | 2];
      if (explic) {
        texto(explic, { size: 9, cor: [60, 60, 60], gapAfter: 4 });
      }
    } else {
      y += 4;
    }
  });

  y += 2;
  linha();

  // === FUNDAMENTAÇÃO ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(107, 107, 107);
  doc.text("FUNDAMENTAÇÃO", margin, y);
  y += 5;

  demanda.diagnostico.motivos.forEach((m) => {
    texto(`•  ${m}`, { size: 10, gapAfter: 3 });
  });

  y += 2;

  // === PRÓXIMO PASSO ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(107, 107, 107);
  doc.text("PRÓXIMO PASSO", margin, y);
  y += 5;
  texto(demanda.diagnostico.proximoPasso, { size: 10, gapAfter: 6 });

  // === RODAPÉ ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Decision Tree · Brand & MKT · Tátil  ·  Página ${i} de ${totalPages}`,
      margin,
      292
    );
  }

  const nomeArquivo = (demanda.nome || "demanda")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  doc.save(`${nomeArquivo || "demanda"}-${demanda.id.slice(0, 8)}.pdf`);
}

function corPorVeredito(v: string): [number, number, number] {
  switch (v) {
    case "canal_oficial":
      return [58, 74, 63]; // moss
    case "canal_direto":
      return [10, 10, 10]; // ink
    case "roteia":
      return [200, 85, 61]; // ember
    case "recusa":
      return [10, 10, 10]; // ink (border red would need stroke, simplificado)
    case "avaliacao":
      return [250, 248, 244]; // paper
    case "pendente":
    default:
      return [240, 238, 232];
  }
}

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
