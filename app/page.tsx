"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  baixarComoPdf,
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

  const vereditoStyles: Record<
    string,
    { bg: string; text: string; accent: string }
  > = {
    canal_oficial: {
      bg: "bg-moss",
      text: "text-bone",
      accent: "text-bone/70",
    },
    canal_direto: {
      bg: "bg-ink",
      text: "text-bone",
      accent: "text-bone/70",
    },
    roteia: {
      bg: "bg-ember",
      text: "text-bone",
      accent: "text-bone/80",
    },
    recusa: {
      bg: "bg-ink",
      text: "text-bone",
      accent: "text-ember",
    },
    avaliacao: {
      bg: "bg-paper",
      text: "text-ink",
      accent: "text-ash",
    },
    pendente: {
      bg: "bg-paper",
      text: "text-ink",
      accent: "text-ash",
    },
  };

  const vereditoStyle = vereditoStyles[diagnostico.veredito];

  return (
    <main className="min-h-screen pb-20">
      {/* DOCK NAV */}
      <div className="sticky top-0 z-50 px-4 pt-4 pb-2">
        <nav className="mx-auto max-w-7xl glass-dock rounded-2xl px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/tatil-symbol.png"
              alt="Tátil"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="text-[10px] uppercase tracking-widest text-ash">
              Brand & MKT · Tátil
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <DockButton
              onClick={() => setHistoricoAberto((v) => !v)}
              active={historicoAberto}
            >
              Histórico
              {historico.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-ink text-bone text-[9px] font-bold">
                  {historico.length}
                </span>
              )}
            </DockButton>
            <DockLink href="/estrutura">Como funciona</DockLink>
            <DockButton onClick={novoFiltro} disabled={!temAlgo}>
              Novo
            </DockButton>
          </div>
        </nav>
      </div>

      {/* HEADER */}
      <header className="mx-auto max-w-7xl px-6 md:px-10 pt-10 pb-12">
        <p className="text-[10px] uppercase tracking-widest text-ash mb-3">
          Entrada de demandas · Brand & MKT
        </p>
        <h1 className="font-display text-6xl md:text-8xl leading-[.95] text-ink tracking-wide">
          DECISION
          <br />
          TREE
        </h1>
      </header>

      {/* PAINEL DE HISTÓRICO */}
      {historicoAberto && (
        <section className="mx-auto max-w-7xl px-6 md:px-10 mb-12">
          <div className="bg-paper border border-line rounded-2xl p-6 shadow-card">
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-ash mb-1">
                  Demandas salvas
                </p>
                <h2 className="font-display text-3xl tracking-wide text-ink">
                  HISTÓRICO
                </h2>
              </div>
              <button
                onClick={() => setHistoricoAberto(false)}
                className="text-[10px] uppercase tracking-wider text-ash hover:text-ink transition lift"
              >
                Fechar
              </button>
            </div>
            {historico.length === 0 ? (
              <p className="text-sm text-ash py-6 text-center">
                Nenhuma demanda salva ainda. Use "Salvar" no painel direito.
              </p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {historico.map((d) => (
                  <HistoricoCard
                    key={d.id}
                    demanda={d}
                    onAbrir={() => abrir(d)}
                    onBaixar={() => baixarComoPdf(d)}
                    onRemover={() => remover(d.id)}
                  />
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14">
        {/* COLUNA ESQUERDA */}
        <section className="space-y-12">
          {/* Identificação */}
          <Bloco titulo="A DEMANDA" subtitulo="Identificação básica">
            <div className="space-y-4">
              <Input
                value={nome}
                onChange={setNome}
                placeholder="Nome da demanda"
              />
              <Input
                value={solicitante}
                onChange={setSolicitante}
                placeholder="Quem está demandando"
              />
              <Textarea
                value={descricao}
                onChange={setDescricao}
                placeholder="Descrição breve"
              />
            </div>
          </Bloco>

          {/* GATES */}
          <Bloco
            titulo="FILTROS"
            subtitulo="Eliminatórios"
            acao={
              <button
                onClick={limparGates}
                className="text-[10px] uppercase tracking-wider text-ash hover:text-ember transition"
              >
                Limpar
              </button>
            }
          >
            <div className="space-y-7">
              {GATES.map((g) => {
                const respostaAtual = gates[g.id];
                return (
                  <div
                    key={g.id}
                    className="space-y-3"
                    onMouseEnter={() => setHoverGate(g.id)}
                    onMouseLeave={() => setHoverGate(null)}
                  >
                    <h3 className="font-display text-2xl tracking-wide text-ink">
                      {g.titulo.toUpperCase()}
                    </h3>
                    <p className="text-sm text-ink/70 leading-relaxed">
                      {g.pergunta}
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      {g.opcoes.map((op) => {
                        const ativo = respostaAtual === op.valor;
                        return (
                          <OptionButton
                            key={op.valor}
                            ativo={ativo}
                            onClick={() => escolherGate(g.id, op.valor)}
                          >
                            {op.label}
                          </OptionButton>
                        );
                      })}
                    </div>
                    {g.id === "g3" && respostaAtual === "nao" && (
                      <div className="pt-3">
                        <label className="text-[10px] uppercase tracking-widest text-ash block mb-2">
                          Setor de destino
                        </label>
                        <select
                          value={setor}
                          onChange={(e) => setSetor(e.target.value)}
                          className="w-full bg-paper border border-line focus:border-ink rounded-lg py-2.5 px-3 text-ink text-sm outline-none transition shadow-card"
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
          </Bloco>

          {/* SCORE */}
          <Bloco
            titulo="SCORE"
            subtitulo="Estratégico"
            acao={
              <button
                onClick={limparScores}
                className="text-[10px] uppercase tracking-wider text-ash hover:text-ember transition"
              >
                Limpar
              </button>
            }
          >
            <div className="space-y-7">
              {SCORES.map((s) => {
                const respostaAtual = scores[s.id];
                return (
                  <div
                    key={s.id}
                    className="space-y-3"
                    onMouseEnter={() => setHoverScore(s.id)}
                    onMouseLeave={() => setHoverScore(null)}
                  >
                    <h3 className="font-display text-2xl tracking-wide text-ink">
                      {s.titulo.toUpperCase()}
                    </h3>
                    <p className="text-sm text-ink/70 leading-relaxed">
                      {s.pergunta}
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      {s.opcoes.map((op) => {
                        const ativo = respostaAtual === op.valor;
                        return (
                          <OptionButton
                            key={op.valor}
                            ativo={ativo}
                            onClick={() => escolherScore(s.id, op.valor)}
                            leading={
                              <span className="font-mono text-[10px] tracking-wider opacity-70">
                                {op.valor}
                              </span>
                            }
                          >
                            {op.label}
                          </OptionButton>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Bloco>

          <p className="text-[11px] text-ash/80 italic">
            Clique novamente na resposta selecionada para desfazer.
          </p>
        </section>

        {/* COLUNA DIREITA */}
        <aside className="lg:sticky lg:top-28 lg:self-start space-y-5">
          {/* VEREDITO — capa */}
          <div
            className={`${vereditoStyle.bg} ${vereditoStyle.text} rounded-2xl p-7 shadow-veredito transition-colors relative overflow-hidden`}
          >
            <div className="absolute top-0 left-[14%] right-[14%] h-px bg-gradient-to-r from-transparent via-bone/40 to-transparent" />
            <p
              className={`text-[10px] uppercase tracking-widest ${vereditoStyle.accent} mb-2`}
            >
              Veredito
            </p>
            <p className="font-display text-5xl md:text-6xl leading-[.92] tracking-wide">
              {vereditoLabel(diagnostico.veredito).toUpperCase()}
            </p>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p
                  className={`text-[10px] uppercase tracking-widest ${vereditoStyle.accent} mb-1`}
                >
                  Score
                </p>
                <p className="font-display text-4xl tracking-wide">
                  {diagnostico.scoreTotal}
                  <span className="opacity-50 text-2xl">
                    /{diagnostico.scoreMaximo}
                  </span>
                </p>
              </div>
              <div className="flex gap-1.5 mb-1.5">
                {diagnostico.gatesStatus.map((g, i) => (
                  <div
                    key={g.id}
                    className={`w-2.5 h-2.5 rounded-full ${
                      g.status === "passa"
                        ? "bg-bone"
                        : g.status === "bloqueia"
                          ? "bg-ember"
                          : g.status === "intermediario"
                            ? "bg-bone/50"
                            : "bg-bone/15 border border-bone/30"
                    }`}
                    title={`Filtro ${i + 1}: ${g.status}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ORIENTAÇÃO CONTEXTUAL */}
          <div className="bg-paper border border-line rounded-2xl p-5 shadow-card">
            <p className="text-[10px] uppercase tracking-widest text-ash mb-3">
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

          {/* REFERÊNCIAS DOBRÁVEIS */}
          <div className="space-y-2">
            <Referencia titulo="Brand Statement 2034">
              <p className="italic font-display text-base leading-snug tracking-wide text-ink/85">
                {BRAND_STATEMENT}
              </p>
            </Referencia>
            <Referencia titulo="Metas EOS">
              <ul className="space-y-2.5">
                {METAS_Q2.map((m) => (
                  <li key={m.numero} className="text-ink/80 leading-relaxed">
                    <span className="font-semibold text-ink">
                      Meta {m.numero}. {m.titulo}.
                    </span>{" "}
                    {m.descricao}
                  </li>
                ))}
              </ul>
            </Referencia>
            <Referencia titulo="Os 4Fs">
              <ul className="space-y-1.5">
                {QUATRO_FS.map((f) => (
                  <li key={f.letra} className="text-ink/80">
                    <span className="font-semibold text-ink">{f.letra}.</span>{" "}
                    {f.descricao}
                  </li>
                ))}
              </ul>
            </Referencia>
          </div>

          {/* AÇÕES */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={salvar}
              disabled={!temAlgo}
              className={`lift py-3.5 px-4 rounded-xl text-[11px] uppercase tracking-widest font-semibold shadow-pill ${
                temAlgo
                  ? "bg-paper text-ink border border-ink/15 hover:border-ink"
                  : "bg-paper/50 text-ash/50 border border-line cursor-not-allowed"
              }`}
            >
              {salvoFlash ? "Salvo" : idAtual ? "Atualizar" : "Salvar"}
            </button>
            <button
              onClick={copiarResposta}
              disabled={!diagnostico.podeFinalizar}
              className={`lift py-3.5 px-4 rounded-xl text-[11px] uppercase tracking-widest font-semibold shadow-pill ${
                diagnostico.podeFinalizar
                  ? "bg-ink text-bone hover:bg-ember"
                  : "bg-ash/15 text-ash cursor-not-allowed"
              }`}
            >
              {textoCopiado ? "Copiado" : "Copiar resposta"}
            </button>
          </div>
        </aside>
      </div>

      <footer className="mx-auto max-w-7xl px-6 md:px-10 mt-24 pt-6 border-t border-line flex items-baseline justify-between flex-wrap gap-2">
        <p className="text-[10px] uppercase tracking-widest text-ash">
          Histórico salvo localmente · Em breve sincronizado em nuvem
        </p>
        <Link
          href="/estrutura"
          className="text-[10px] uppercase tracking-widest text-ash hover:text-ink transition"
        >
          Ver fluxo da árvore →
        </Link>
      </footer>
    </main>
  );
}

/* ────────── COMPONENTES ────────── */

function DockButton({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`lift px-3.5 py-2 rounded-lg text-[10px] uppercase tracking-widest font-semibold transition ${
        disabled
          ? "text-ash/40 cursor-not-allowed"
          : active
            ? "bg-ink text-bone"
            : "bg-paper/60 text-ink hover:bg-paper border border-line"
      }`}
    >
      {children}
    </button>
  );
}

function DockLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="lift px-3.5 py-2 rounded-lg text-[10px] uppercase tracking-widest font-semibold text-ink bg-paper/60 hover:bg-paper border border-line transition"
    >
      {children}
    </Link>
  );
}

function Bloco({
  titulo,
  subtitulo,
  acao,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  acao?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <div>
          {subtitulo && (
            <p className="text-[10px] uppercase tracking-widest text-ash mb-1">
              {subtitulo}
            </p>
          )}
          <h2 className="font-display text-3xl tracking-wide text-ink">
            {titulo}
          </h2>
        </div>
        {acao}
      </div>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-paper border border-line focus:border-ink rounded-xl py-3 px-4 text-ink placeholder:text-ash/60 outline-none transition shadow-card text-sm"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="w-full bg-paper border border-line focus:border-ink rounded-xl py-3 px-4 text-ink placeholder:text-ash/60 outline-none transition resize-none shadow-card text-sm"
    />
  );
}

function OptionButton({
  ativo,
  onClick,
  leading,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  leading?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`lift text-left text-sm py-3 px-4 rounded-xl flex items-center gap-3 ${
        ativo
          ? "bg-ink text-bone shadow-veredito"
          : "bg-paper border border-line text-ink hover:border-ink shadow-card hover:shadow-cardHover"
      }`}
    >
      {leading}
      <span className="flex-1">{children}</span>
    </button>
  );
}

function HistoricoCard({
  demanda,
  onAbrir,
  onBaixar,
  onRemover,
}: {
  demanda: DemandaSalva;
  onAbrir: () => void;
  onBaixar: () => void;
  onRemover: () => void;
}) {
  const cor: Record<string, string> = {
    canal_oficial: "bg-moss text-bone",
    canal_direto: "bg-ink text-bone",
    roteia: "bg-ember text-bone",
    recusa: "bg-ink/90 text-bone",
    avaliacao: "bg-paper text-ink border border-ash/40",
    pendente: "bg-ash/20 text-ink",
  };
  return (
    <li className="lift bg-bone border border-line rounded-xl p-4 shadow-card hover:shadow-cardHover cursor-pointer group" onClick={onAbrir}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={`text-[9px] uppercase tracking-wider font-bold py-1 px-2 rounded ${cor[demanda.diagnostico.veredito]}`}
        >
          {vereditoLabel(demanda.diagnostico.veredito)}
        </span>
        <span className="font-mono text-[10px] text-ash tabular-nums">
          {demanda.diagnostico.scoreTotal}/{demanda.diagnostico.scoreMaximo}
        </span>
      </div>
      <h3 className="font-display text-2xl tracking-wide text-ink leading-tight mb-1.5 truncate">
        {(demanda.nome || "Sem nome").toUpperCase()}
      </h3>
      <p className="text-[11px] text-ash mb-3">
        {demanda.solicitante || "Sem solicitante"} ·{" "}
        {new Date(demanda.atualizadoEm).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })}
      </p>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAbrir();
          }}
          className="text-ink hover:text-ember font-semibold"
        >
          Abrir
        </button>
        <span className="text-line">·</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBaixar();
          }}
          className="text-ash hover:text-ink"
        >
          Baixar
        </button>
        <span className="text-line">·</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemover();
          }}
          className="text-ash hover:text-ember"
        >
          Remover
        </button>
      </div>
    </li>
  );
}

function Referencia({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <details className="bg-paper border border-line rounded-xl shadow-card group">
      <summary className="cursor-pointer px-4 py-3 flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold text-ink hover:text-ember transition list-none">
        {titulo}
        <span className="text-ash group-open:rotate-90 transition-transform">
          ›
        </span>
      </summary>
      <div className="px-4 pb-4 text-sm">{children}</div>
    </details>
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
        <div className="pt-3 border-t border-line">
          <p className="text-[10px] uppercase tracking-widest text-ash mb-1.5">
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
        <div className="pt-3 border-t border-line">
          <p className="text-[10px] uppercase tracking-widest text-ash mb-1.5">
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
        Responda os filtros e os critérios de score para gerar o veredito. Passe
        o mouse sobre cada item à esquerda para ver a orientação completa.
      </p>
    );
  }
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-ash mb-2">
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
      <div className="pt-3 border-t border-line">
        <p className="text-[10px] uppercase tracking-widest text-ash mb-2">
          Próximo passo
        </p>
        <p className="text-ink">{diagnostico.proximoPasso}</p>
      </div>
    </div>
  );
}
