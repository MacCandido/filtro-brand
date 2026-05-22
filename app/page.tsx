"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  GATES,
  SCORES,
  GateAnswer,
  GateId,
  ScoreId,
  ScoreValue,
  QUATRO_FS,
  METAS_Q2,
  BRAND_STATEMENT,
} from "@/lib/criteria";
import { calcularDiagnostico, vereditoLabel } from "@/lib/logic";
import { gerarTextoResposta } from "@/lib/export";
import {
  listarDemandas,
  salvarDemanda,
  carregarDemanda,
  removerDemanda,
  baixarComoJson,
  DemandaSalva,
} from "@/lib/storage";

const SETORES = [
  "RH / Cultura (Renata)",
  "Negócios (Pedro / Olga)",
  "Digital",
  "Design",
  "Comercial",
  "Outro",
];

const estadoInicial = {
  nome: "",
  solicitante: "",
  descricao: "",
  gates: { g1: null, g2: null, g3: null } as Record<GateId, GateAnswer>,
  scores: { c1: null, c2: null, c3: null, c4: null, c5: null } as Record<
    ScoreId,
    ScoreValue
  >,
  setor: "",
};

export default function Page() {
  const [nome, setNome] = useState(estadoInicial.nome);
  const [solicitante, setSolicitante] = useState(estadoInicial.solicitante);
  const [descricao, setDescricao] = useState(estadoInicial.descricao);
  const [gates, setGates] = useState(estadoInicial.gates);
  const [scores, setScores] = useState(estadoInicial.scores);
  const [setor, setSetor] = useState(estadoInicial.setor);

  const [idAtual, setIdAtual] = useState<string | null>(null);
  const [historico, setHistorico] = useState<DemandaSalva[]>([]);
  const [historicoAberto, setHistoricoAberto] = useState(false);

  const [textoCopiado, setTextoCopiado] = useState(false);
  const [salvoFlash, setSalvoFlash] = useState(false);
  const [hoverGate, setHoverGate] = useState<GateId | null>(null);
  const [hoverScore, setHoverScore] = useState<ScoreId | null>(null);

  useEffect(() => {
    setHistorico(listarDemandas());
  }, []);

  const diagnostico = useMemo(
    () => calcularDiagnostico({ gates, scores }),
    [gates, scores]
  );

  function novoFiltro() {
    setNome(estadoInicial.nome);
    setSolicitante(estadoInicial.solicitante);
    setDescricao(estadoInicial.descricao);
    setGates(estadoInicial.gates);
    setScores(estadoInicial.scores);
    setSetor(estadoInicial.setor);
    setIdAtual(null);
  }

  function limparGates() {
    setGates({ g1: null, g2: null, g3: null });
    setSetor("");
  }

  function limparScores() {
    setScores({ c1: null, c2: null, c3: null, c4: null, c5: null });
  }

  function escolherGate(id: GateId, valor: Exclude<GateAnswer, null>) {
    setGates((prev) => ({
      ...prev,
      [id]: prev[id] === valor ? null : valor,
    }));
  }

  function escolherScore(id: ScoreId, valor: 0 | 1 | 2) {
    setScores((prev) => ({
      ...prev,
      [id]: prev[id] === valor ? null : (valor as ScoreValue),
    }));
  }

  function salvar() {
    const salva = salvarDemanda(
      {
        nome,
        solicitante,
        descricao,
        estado: { gates, scores, setorRoteamento: setor },
        diagnostico,
      },
      idAtual ?? undefined
    );
    setIdAtual(salva.id);
    setHistorico(listarDemandas());
    setSalvoFlash(true);
    setTimeout(() => setSalvoFlash(false), 2000);
  }

  function abrir(d: DemandaSalva) {
    setNome(d.nome);
    setSolicitante(d.solicitante);
    setDescricao(d.descricao);
    setGates(d.estado.gates);
    setScores(d.estado.scores);
    setSetor(d.estado.setorRoteamento ?? "");
    setIdAtual(d.id);
    setHistoricoAberto(false);
  }

  function remover(id: string) {
    if (!confirm("Remover esta demanda do histórico?")) return;
    removerDemanda(id);
    setHistorico(listarDemandas());
    if (idAtual === id) novoFiltro();
  }

  async function copiarResposta() {
    const texto = gerarTextoResposta(
      { nome, solicitante, descricao },
      { gates, scores, setorRoteamento: setor },
      diagnostico
    );
    await navigator.clipboard.writeText(texto);
    setTextoCopiado(true);
    setTimeout(() => setTextoCopiado(false), 2200);
  }

  const temAlgo =
    nome ||
    solicitante ||
    descricao ||
    Object.values(gates).some((v) => v !== null) ||
    Object.values(scores).some((v) => v !== null);

  const vereditoCor: Record<string, string> = {
    canal_oficial: "bg-moss text-bone",
    canal_direto: "bg-ink text-bone",
    roteia: "bg-ember text-bone",
    recusa: "bg-ink text-bone border border-ember",
    pendente: "bg-bone text-ink border border-ash/30",
  };

  return (
    <main className="min-h-screen px-6 py-10 md:px-12 md:py-14">
      <header className="mx-auto max-w-7xl mb-10">
        <div className="flex items-baseline justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ash mb-2">
              Brand, Marketing & Comunicação
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
              Filtro de demandas
            </h1>
          </div>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-wider">
            <button
              onClick={() => setHistoricoAberto((v) => !v)}
              className="text-ash hover:text-ink transition border-b border-transparent hover:border-ink pb-0.5"
            >
              Histórico ({historico.length})
            </button>
            <Link
              href="/estrutura"
              className="text-ash hover:text-ink transition border-b border-transparent hover:border-ink pb-0.5"
            >
              Como funciona
            </Link>
            <button
              onClick={novoFiltro}
              disabled={!temAlgo}
              className={`transition border-b border-transparent pb-0.5 ${
                temAlgo
                  ? "text-ash hover:text-ink hover:border-ink"
                  : "text-ash/40 cursor-not-allowed"
              }`}
            >
              Novo filtro
            </button>
          </nav>
        </div>
        <p className="mt-4 text-sm text-ash max-w-2xl leading-relaxed">
          Valida demandas contra o Brand Statement 2034, as metas do trimestre e
          os 4Fs. Use durante a conversa com quem está demandando. O box da
          direita atualiza em tempo real.
        </p>
      </header>

      {/* PAINEL DE HISTÓRICO */}
      {historicoAberto && (
        <div className="mx-auto max-w-7xl mb-10 bg-ink/[0.03] border border-ash/20 p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-2xl text-ink">Demandas salvas</h2>
            <button
              onClick={() => setHistoricoAberto(false)}
              className="text-xs uppercase tracking-wider text-ash hover:text-ink"
            >
              Fechar
            </button>
          </div>
          {historico.length === 0 ? (
            <p className="text-sm text-ash">
              Nenhuma demanda salva ainda. Clique em "Salvar" no fim do
              questionário para guardar o filtro atual.
            </p>
          ) : (
            <ul className="divide-y divide-ash/15">
              {historico.map((d) => (
                <li
                  key={d.id}
                  className="py-3 flex flex-wrap items-baseline gap-3 justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-medium truncate">
                      {d.nome || "Sem nome"}
                    </p>
                    <p className="text-xs text-ash mt-0.5">
                      {d.solicitante || "Sem solicitante"} ·{" "}
                      {vereditoLabel(d.diagnostico.veredito)} · Score{" "}
                      {d.diagnostico.scoreTotal}/{d.diagnostico.scoreMaximo} ·{" "}
                      {new Date(d.atualizadoEm).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wider">
                    <button
                      onClick={() => abrir(d)}
                      className="text-ink hover:text-ember transition"
                    >
                      Abrir
                    </button>
                    <button
                      onClick={() => baixarComoJson(d)}
                      className="text-ash hover:text-ink transition"
                    >
                      Baixar
                    </button>
                    <button
                      onClick={() => remover(d.id)}
                      className="text-ash hover:text-ember transition"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12">
        {/* COLUNA ESQUERDA — QUESTIONÁRIO */}
        <section className="space-y-10">
          {/* Identificação da demanda */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink">A demanda</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da demanda"
                className="w-full bg-transparent border-b border-ash/40 focus:border-ink py-2 text-ink placeholder:text-ash/60 outline-none transition"
              />
              <input
                type="text"
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
                placeholder="Quem está demandando"
                className="w-full bg-transparent border-b border-ash/40 focus:border-ink py-2 text-ink placeholder:text-ash/60 outline-none transition"
              />
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição breve"
                rows={2}
                className="w-full bg-transparent border-b border-ash/40 focus:border-ink py-2 text-ink placeholder:text-ash/60 outline-none transition resize-none"
              />
            </div>
          </div>

          {/* GATES */}
          <div className="space-y-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-2xl text-ink">
                Filtros eliminatórios
              </h2>
              <button
                onClick={limparGates}
                className="text-xs uppercase tracking-wider text-ash hover:text-ink transition"
              >
                Limpar
              </button>
            </div>
            {GATES.map((g) => {
              const respostaAtual = gates[g.id];
              return (
                <div
                  key={g.id}
                  className="space-y-3"
                  onMouseEnter={() => setHoverGate(g.id)}
                  onMouseLeave={() => setHoverGate(null)}
                >
                  <h3 className="text-ink font-medium">{g.titulo}</h3>
                  <p className="text-sm text-ash leading-relaxed">
                    {g.pergunta}
                  </p>
                  <div className="flex flex-col gap-2">
                    {g.opcoes.map((op) => {
                      const ativo = respostaAtual === op.valor;
                      return (
                        <button
                          key={op.valor}
                          onClick={() => escolherGate(g.id, op.valor)}
                          className={`text-left text-sm py-2 px-3 border transition ${
                            ativo
                              ? "border-ink bg-ink text-bone"
                              : "border-ash/30 text-ink hover:border-ink"
                          }`}
                        >
                          {op.label}
                        </button>
                      );
                    })}
                  </div>
                  {g.id === "g3" && respostaAtual === "nao" && (
                    <div className="pt-2">
                      <label className="text-xs uppercase tracking-wider text-ash">
                        Setor de destino
                      </label>
                      <select
                        value={setor}
                        onChange={(e) => setSetor(e.target.value)}
                        className="w-full bg-transparent border-b border-ash/40 focus:border-ink py-2 text-ink outline-none mt-1"
                      >
                        <option value="">Selecionar setor</option>
                        {SETORES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SCORE */}
          <div className="space-y-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-2xl text-ink">
                Score estratégico
              </h2>
              <button
                onClick={limparScores}
                className="text-xs uppercase tracking-wider text-ash hover:text-ink transition"
              >
                Limpar
              </button>
            </div>
            {SCORES.map((s) => {
              const respostaAtual = scores[s.id];
              return (
                <div
                  key={s.id}
                  className="space-y-3"
                  onMouseEnter={() => setHoverScore(s.id)}
                  onMouseLeave={() => setHoverScore(null)}
                >
                  <h3 className="text-ink font-medium">{s.titulo}</h3>
                  <p className="text-sm text-ash leading-relaxed">
                    {s.pergunta}
                  </p>
                  <div className="flex flex-col gap-2">
                    {s.opcoes.map((op) => {
                      const ativo = respostaAtual === op.valor;
                      return (
                        <button
                          key={op.valor}
                          onClick={() => escolherScore(s.id, op.valor)}
                          className={`text-left text-sm py-2 px-3 border transition flex items-center gap-3 ${
                            ativo
                              ? "border-ink bg-ink text-bone"
                              : "border-ash/30 text-ink hover:border-ink"
                          }`}
                        >
                          <span className="font-mono text-xs">{op.valor}</span>
                          <span>{op.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-ash/70">
            Clique novamente na resposta selecionada para desfazer.
          </p>
        </section>

        {/* COLUNA DIREITA — BOX DIAGNÓSTICO */}
        <aside className="lg:sticky lg:top-10 lg:self-start space-y-6">
          {/* Veredito */}
          <div
            className={`p-6 ${vereditoCor[diagnostico.veredito]} transition-colors`}
          >
            <p className="text-xs uppercase tracking-[0.25em] opacity-70 mb-2">
              Veredito
            </p>
            <p className="font-serif text-3xl leading-tight">
              {vereditoLabel(diagnostico.veredito)}
            </p>
            <div className="mt-4 flex items-end gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider opacity-70">
                  Score
                </p>
                <p className="font-mono text-2xl mt-1">
                  {diagnostico.scoreTotal}
                  <span className="opacity-50 text-base">
                    {" "}
                    / {diagnostico.scoreMaximo}
                  </span>
                </p>
              </div>
              <div className="flex gap-1.5 mb-1">
                {diagnostico.gatesStatus.map((g) => (
                  <div
                    key={g.id}
                    className={`w-3 h-3 rounded-full ${
                      g.status === "passa"
                        ? "bg-bone"
                        : g.status === "bloqueia"
                          ? "bg-ember"
                          : g.status === "intermediario"
                            ? "bg-bone/50"
                            : "bg-bone/20 border border-bone/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Explicação contextual */}
          <div className="bg-ink/[0.03] border border-ash/20 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-ash mb-3">
              {hoverGate
                ? `Orientação · ${GATES.find((g) => g.id === hoverGate)?.titulo}`
                : hoverScore
                  ? `Orientação · ${SCORES.find((s) => s.id === hoverScore)?.titulo}`
                  : "Diagnóstico atual"}
            </p>

            {hoverGate ? (
              <ExplicacaoGate gateId={hoverGate} resposta={gates[hoverGate]} />
            ) : hoverScore ? (
              <ExplicacaoScore
                scoreId={hoverScore}
                resposta={scores[hoverScore]}
              />
            ) : (
              <DiagnosticoGeral diagnostico={diagnostico} />
            )}
          </div>

          {/* Orientação dobrável */}
          <div className="text-xs text-ash space-y-3 leading-relaxed">
            <details className="cursor-pointer">
              <summary className="uppercase tracking-wider hover:text-ink transition">
                Brand Statement 2034
              </summary>
              <p className="mt-2 italic text-ink/80 font-serif text-base leading-relaxed">
                {BRAND_STATEMENT}
              </p>
            </details>
            <details className="cursor-pointer">
              <summary className="uppercase tracking-wider hover:text-ink transition">
                Metas do trimestre
              </summary>
              <ul className="mt-2 space-y-2">
                {METAS_Q2.map((m) => (
                  <li key={m.numero} className="text-ink/80">
                    <span className="font-medium">
                      Meta {m.numero}. {m.titulo}.
                    </span>{" "}
                    {m.descricao}
                  </li>
                ))}
              </ul>
            </details>
            <details className="cursor-pointer">
              <summary className="uppercase tracking-wider hover:text-ink transition">
                4Fs
              </summary>
              <ul className="mt-2 space-y-1">
                {QUATRO_FS.map((f) => (
                  <li key={f.letra} className="text-ink/80">
                    <span className="font-medium">{f.letra}.</span>{" "}
                    {f.descricao}
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Ações */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              onClick={salvar}
              disabled={!temAlgo}
              className={`py-3 px-4 text-sm uppercase tracking-wider transition ${
                temAlgo
                  ? "border border-ink text-ink hover:bg-ink hover:text-bone"
                  : "border border-ash/30 text-ash/50 cursor-not-allowed"
              }`}
            >
              {salvoFlash
                ? "Salvo"
                : idAtual
                  ? "Atualizar"
                  : "Salvar"}
            </button>
            <button
              onClick={copiarResposta}
              disabled={!diagnostico.podeFinalizar}
              className={`py-3 px-4 text-sm uppercase tracking-wider transition ${
                diagnostico.podeFinalizar
                  ? "bg-ink text-bone hover:bg-ember"
                  : "bg-ash/20 text-ash cursor-not-allowed"
              }`}
            >
              {textoCopiado ? "Copiado" : "Copiar resposta"}
            </button>
          </div>
        </aside>
      </div>

      <footer className="mx-auto max-w-7xl mt-20 pt-6 border-t border-ash/20 flex items-baseline justify-between flex-wrap gap-2">
        <p className="text-xs text-ash">
          Histórico salvo localmente neste navegador. Em breve sincronizado em
          nuvem.
        </p>
        <Link
          href="/estrutura"
          className="text-xs text-ash hover:text-ink transition uppercase tracking-wider"
        >
          Ver fluxo da árvore
        </Link>
      </footer>
    </main>
  );
}

function ExplicacaoGate({
  gateId,
  resposta,
}: {
  gateId: GateId;
  resposta: GateAnswer;
}) {
  const g = GATES.find((g) => g.id === gateId);
  if (!g) return null;
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <p className="text-ink/80">{g.explicacao.base}</p>
      {resposta && g.explicacao.porValor[resposta] && (
        <div className="pt-2 border-t border-ash/15">
          <p className="text-xs uppercase tracking-wider text-ash mb-1.5">
            Sua resposta
          </p>
          <p className="text-ink">{g.explicacao.porValor[resposta]}</p>
        </div>
      )}
    </div>
  );
}

function ExplicacaoScore({
  scoreId,
  resposta,
}: {
  scoreId: ScoreId;
  resposta: ScoreValue;
}) {
  const s = SCORES.find((s) => s.id === scoreId);
  if (!s) return null;
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <p className="text-ink/80">{s.explicacao.base}</p>
      {resposta !== null && (
        <div className="pt-2 border-t border-ash/15">
          <p className="text-xs uppercase tracking-wider text-ash mb-1.5">
            Pontuação {resposta} de 2
          </p>
          <p className="text-ink">{s.explicacao.porValor[resposta]}</p>
        </div>
      )}
    </div>
  );
}

function DiagnosticoGeral({
  diagnostico,
}: {
  diagnostico: ReturnType<typeof calcularDiagnostico>;
}) {
  if (diagnostico.veredito === "pendente") {
    return (
      <p className="text-sm text-ink/70 leading-relaxed">
        Responda os filtros eliminatórios e os critérios de score para gerar o
        veredito. Passe o mouse sobre cada item à esquerda para ver a
        orientação completa.
      </p>
    );
  }
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <div>
        <p className="text-xs uppercase tracking-wider text-ash mb-1.5">
          Fundamentação
        </p>
        <ul className="space-y-1.5">
          {diagnostico.motivos.map((m, i) => (
            <li key={i} className="text-ink/85">
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-3 border-t border-ash/15">
        <p className="text-xs uppercase tracking-wider text-ash mb-1.5">
          Próximo passo
        </p>
        <p className="text-ink">{diagnostico.proximoPasso}</p>
      </div>
    </div>
  );
}
