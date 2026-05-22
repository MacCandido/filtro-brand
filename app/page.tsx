"use client";

import { useMemo, useState } from "react";
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

const SETORES = [
  "RH / Cultura (Renata)",
  "Negócios (Pedro / Olga)",
  "Digital",
  "Design",
  "Comercial",
  "Outro",
];

export default function Page() {
  const [nome, setNome] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [descricao, setDescricao] = useState("");

  const [gates, setGates] = useState<Record<GateId, GateAnswer>>({
    g1: null,
    g2: null,
    g3: null,
  });
  const [scores, setScores] = useState<Record<ScoreId, ScoreValue>>({
    c1: null,
    c2: null,
    c3: null,
    c4: null,
    c5: null,
  });
  const [setor, setSetor] = useState<string>("");

  const [textoCopiado, setTextoCopiado] = useState(false);
  const [hoverGate, setHoverGate] = useState<GateId | null>(null);
  const [hoverScore, setHoverScore] = useState<ScoreId | null>(null);

  const diagnostico = useMemo(
    () => calcularDiagnostico({ gates, scores }),
    [gates, scores]
  );

  function resetar() {
    setNome("");
    setSolicitante("");
    setDescricao("");
    setGates({ g1: null, g2: null, g3: null });
    setScores({ c1: null, c2: null, c3: null, c4: null, c5: null });
    setSetor("");
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
          <button
            onClick={resetar}
            className="text-xs uppercase tracking-wider text-ash hover:text-ink transition border-b border-transparent hover:border-ink pb-0.5"
          >
            Novo filtro
          </button>
        </div>
        <p className="mt-4 text-sm text-ash max-w-2xl leading-relaxed">
          Valida demandas contra o Brand Statement 2034, o EOS Q2 2026 e os 4Fs.
          Use durante a conversa com quem está demandando. O box da direita
          atualiza em tempo real e gera a resposta pronta no final.
        </p>
      </header>

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
            <h2 className="font-serif text-2xl text-ink">
              Gates eliminatórios
            </h2>
            {GATES.map((g) => {
              const respostaAtual = gates[g.id];
              return (
                <div
                  key={g.id}
                  className="space-y-3"
                  onMouseEnter={() => setHoverGate(g.id)}
                  onMouseLeave={() => setHoverGate(null)}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs text-ash tabular-nums">
                      G{g.numero}
                    </span>
                    <h3 className="text-ink font-medium">{g.titulo}</h3>
                  </div>
                  <p className="text-sm text-ash leading-relaxed">
                    {g.pergunta}
                  </p>
                  <div className="flex flex-col gap-2">
                    {g.opcoes.map((op) => {
                      const ativo = respostaAtual === op.valor;
                      return (
                        <button
                          key={op.valor}
                          onClick={() =>
                            setGates((prev) => ({ ...prev, [g.id]: op.valor }))
                          }
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
            <h2 className="font-serif text-2xl text-ink">Score estratégico</h2>
            {SCORES.map((s) => {
              const respostaAtual = scores[s.id];
              return (
                <div
                  key={s.id}
                  className="space-y-3"
                  onMouseEnter={() => setHoverScore(s.id)}
                  onMouseLeave={() => setHoverScore(null)}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs text-ash tabular-nums">
                      C{s.numero}
                    </span>
                    <h3 className="text-ink font-medium">{s.titulo}</h3>
                  </div>
                  <p className="text-sm text-ash leading-relaxed">
                    {s.pergunta}
                  </p>
                  <div className="flex flex-col gap-2">
                    {s.opcoes.map((op) => {
                      const ativo = respostaAtual === op.valor;
                      return (
                        <button
                          key={op.valor}
                          onClick={() =>
                            setScores((prev) => ({
                              ...prev,
                              [s.id]: op.valor as ScoreValue,
                            }))
                          }
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
                  <span className="opacity-50 text-base"> / {diagnostico.scoreMaximo}</span>
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
                    title={`G${diagnostico.gatesStatus.indexOf(g) + 1}: ${g.status}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Explicação contextual */}
          <div className="bg-ink/[0.03] border border-ash/20 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-ash mb-3">
              {hoverGate
                ? `Orientação — Gate ${GATES.find((g) => g.id === hoverGate)?.numero}`
                : hoverScore
                  ? `Orientação — Critério ${SCORES.find((s) => s.id === hoverScore)?.numero}`
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

          {/* Lembrete de orientação */}
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
                Metas EOS Q2 2026
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

          {/* Ação final */}
          <div className="pt-2">
            <button
              onClick={copiarResposta}
              disabled={!diagnostico.podeFinalizar}
              className={`w-full py-3 px-4 text-sm uppercase tracking-wider transition ${
                diagnostico.podeFinalizar
                  ? "bg-ink text-bone hover:bg-ember"
                  : "bg-ash/20 text-ash cursor-not-allowed"
              }`}
            >
              {textoCopiado
                ? "Resposta copiada"
                : diagnostico.podeFinalizar
                  ? "Copiar resposta pronta"
                  : "Aguardando preenchimento"}
            </button>
          </div>
        </aside>
      </div>

      <footer className="mx-auto max-w-7xl mt-20 pt-6 border-t border-ash/20">
        <p className="text-xs text-ash">
          Construído sobre a skill <code>tatil-verbal-frame</code>. Atualizações
          em Brand Statement, EOS ou 4Fs devem ser propagadas no arquivo{" "}
          <code>lib/criteria.ts</code>.
        </p>
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
        Responda os gates e os critérios para gerar o veredito. Passe o mouse
        sobre cada item à esquerda para ver a orientação completa.
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
