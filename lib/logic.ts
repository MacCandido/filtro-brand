import {
  GATES,
  SCORES,
  GateAnswer,
  GateId,
  ScoreValue,
  ScoreId,
} from "./criteria";

export type Veredito =
  | "canal_oficial"
  | "canal_direto"
  | "roteia"
  | "recusa"
  | "pendente";

export interface Estado {
  gates: Record<GateId, GateAnswer>;
  scores: Record<ScoreId, ScoreValue>;
  setorRoteamento?: string;
}

export interface Diagnostico {
  veredito: Veredito;
  scoreTotal: number;
  scoreMaximo: number;
  gatesStatus: { id: GateId; status: "passa" | "bloqueia" | "intermediario" | "pendente" }[];
  motivos: string[];
  proximoPasso: string;
  podeFinalizar: boolean;
}

const VEREDITO_LABEL: Record<Veredito, string> = {
  canal_oficial: "Canal oficial",
  canal_direto: "Canal direto",
  roteia: "Repassar para outro setor",
  recusa: "Recusa formal",
  pendente: "Pendente",
};

export function calcularDiagnostico(estado: Estado): Diagnostico {
  const gatesStatus = GATES.map((g) => {
    const resposta = estado.gates[g.id];
    if (resposta === null) return { id: g.id, status: "pendente" as const };
    const opcao = g.opcoes.find((o) => o.valor === resposta);
    return { id: g.id, status: opcao?.interpretacao ?? ("pendente" as const) };
  });

  const motivos: string[] = [];

  const algumPendente = gatesStatus.some((g) => g.status === "pendente");
  const bloqueado = gatesStatus.find((g) => g.status === "bloqueia");
  const intermediario = gatesStatus.find((g) => g.status === "intermediario");

  // Roteamento por G3
  if (estado.gates.g3 === "nao") {
    motivos.push(
      "A demanda não é do domínio da área de Brand, Marketing & Comunicação."
    );
    return {
      veredito: "roteia",
      scoreTotal: 0,
      scoreMaximo: 10,
      gatesStatus,
      motivos,
      proximoPasso:
        "Encaminhar para o setor competente com nota de contexto. Brand & MKT entra só como guardrail de marca se o outro setor solicitar.",
      podeFinalizar: true,
    };
  }

  // Gates bloqueantes G1 e G2
  if (estado.gates.g1 === "sim") {
    motivos.push(
      "Conflito de portfólio bloqueia publicização. Sigilo ou NDA em vigor."
    );
    return {
      veredito: "recusa",
      scoreTotal: 0,
      scoreMaximo: 10,
      gatesStatus,
      motivos,
      proximoPasso:
        "Recusa formal com fundamento ou absorção interna sem case público. Não vai pros canais oficiais.",
      podeFinalizar: true,
    };
  }

  if (estado.gates.g2 === "nao") {
    motivos.push(
      "Janela de execução não bate. Case envelhecido perde potência como ativo de PR e premiação."
    );
    return {
      veredito: "recusa",
      scoreTotal: 0,
      scoreMaximo: 10,
      gatesStatus,
      motivos,
      proximoPasso:
        "Recusa fundamentada. Sugerir alternativa se houver demanda futura com janela viável.",
      podeFinalizar: true,
    };
  }

  if (intermediario) {
    motivos.push(
      "Conflito de portfólio existe, mas o cliente da demanda tem maior peso comercial."
    );
  }

  // Calcula score
  const scoreTotal = SCORES.reduce((acc, s) => {
    const v = estado.scores[s.id];
    return acc + (v ?? 0);
  }, 0);

  const scoresPendentes = SCORES.some((s) => estado.scores[s.id] === null);

  if (algumPendente || scoresPendentes) {
    return {
      veredito: "pendente",
      scoreTotal,
      scoreMaximo: 10,
      gatesStatus,
      motivos: ["Diagnóstico em construção. Responda os critérios restantes."],
      proximoPasso: "Concluir o questionário para gerar veredito.",
      podeFinalizar: false,
    };
  }

  // Veredito final
  const c5 = estado.scores.c5 ?? 0;

  if (scoreTotal >= 8 && c5 >= 1) {
    motivos.push(
      `Score ${scoreTotal} de 10. Demanda encarna o Brand Statement e ativa metas do quarter.`
    );
    if (intermediario) {
      motivos.push("Validar peso comercial com Pedro antes de publicar.");
    }
    return {
      veredito: "canal_oficial",
      scoreTotal,
      scoreMaximo: 10,
      gatesStatus,
      motivos,
      proximoPasso:
        "Vai pro ar nos canais oficiais. Case completo: site, social, asterisco, PR, newsletter, materiais comerciais. Alinhar narrativa, disparar produção, registrar no fluxo da área.",
      podeFinalizar: true,
    };
  }

  if (scoreTotal >= 5) {
    if (c5 === 0) {
      motivos.push(
        `Score ${scoreTotal} de 10. Sem primor gráfico para canal oficial.`
      );
    } else {
      motivos.push(
        `Score ${scoreTotal} de 10. Aderência parcial ao quarter e ao Brand Statement.`
      );
    }
    return {
      veredito: "canal_direto",
      scoreTotal,
      scoreMaximo: 10,
      gatesStatus,
      motivos,
      proximoPasso:
        "Vai por canal direto. ABM, e-mail segmentado, deck comercial, conteúdo restrito. Definir lista de envio e formato com Comercial. Não entra em Brand Publishing.",
      podeFinalizar: true,
    };
  }

  if (scoreTotal >= 3) {
    motivos.push(
      `Score ${scoreTotal} de 10. Aderência baixa ao quarter, ao Brand Statement e aos 4Fs.`
    );
    return {
      veredito: "roteia",
      scoreTotal,
      scoreMaximo: 10,
      gatesStatus,
      motivos,
      proximoPasso:
        "Não absorve diretamente. A demanda é legítima mas não prioritária para o setor. Sugerir setor alternativo ou propor postergar para próximo quarter.",
      podeFinalizar: true,
    };
  }

  motivos.push(
    `Score ${scoreTotal} de 10. Demanda fora do escopo estratégico do quarter.`
  );
  return {
    veredito: "recusa",
    scoreTotal,
    scoreMaximo: 10,
    gatesStatus,
    motivos,
    proximoPasso:
      "Recusa formal com fundamento. Explicar quais critérios não foram atendidos. Direcionar para alternativa quando houver.",
    podeFinalizar: true,
  };
}

export function vereditoLabel(v: Veredito): string {
  return VEREDITO_LABEL[v];
}
