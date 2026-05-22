import Link from "next/link";
import {
  GATES,
  SCORES,
  QUATRO_FS,
  METAS_Q2,
  BRAND_STATEMENT,
} from "@/lib/criteria";
import DecisionTreeViz from "@/components/DecisionTreeViz";

export const metadata = {
  title: "Como funciona — Filtro de Demandas Tátil",
};

export default function EstruturaPage() {
  return (
    <main className="min-h-screen pb-20">
      {/* DOCK */}
      <div className="sticky top-0 z-50 px-4 pt-4 pb-2">
        <nav className="mx-auto max-w-4xl glass-dock rounded-2xl px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-3">
            <span className="font-display text-2xl tracking-wide text-ink">
              FILTRO
            </span>
            <span className="text-[10px] uppercase tracking-widest text-ash">
              Brand & MKT · Tátil
            </span>
          </Link>
          <Link
            href="/"
            className="lift px-3.5 py-2 rounded-lg text-[10px] uppercase tracking-widest font-semibold text-ink bg-paper/60 hover:bg-paper border border-line transition"
          >
            ← Voltar
          </Link>
        </nav>
      </div>

      {/* HEADER */}
      <header className="mx-auto max-w-4xl px-6 md:px-10 pt-10 pb-12">
        <p className="text-[10px] uppercase tracking-widest text-ash mb-3">
          Documentação · Árvore decisória
        </p>
        <h1 className="font-display text-6xl md:text-7xl leading-[.95] text-ink tracking-wide">
          COMO
          <br />
          FUNCIONA
        </h1>
        <p className="mt-6 text-base text-ink/75 leading-relaxed max-w-2xl">
          A árvore decide se a demanda entra no setor, em qual canal sai, ou
          para qual outro setor deve ser encaminhada. Três camadas, em ordem.
        </p>
      </header>

      <article className="mx-auto max-w-4xl px-6 md:px-10 space-y-20">
        {/* Fluxograma visual */}
        <section>
          <Subtitulo numero="00" titulo="A ÁRVORE" />
          <DecisionTreeViz />
          <p className="text-[11px] text-ash mt-4 italic">
            Em telas menores, role o diagrama horizontalmente.
          </p>
        </section>

        {/* O fluxo */}
        <section>
          <Subtitulo numero="01" titulo="O FLUXO" />
          <ol className="space-y-5">
            <PassoFluxo
              numero="1"
              titulo="Filtros eliminatórios"
              texto="Três perguntas em ordem. Qualquer não viola o gate e leva a recusa ou roteamento. Conflito de portfólio, janela de execução, e domínio do setor."
            />
            <PassoFluxo
              numero="2"
              titulo="Score estratégico"
              texto="Cinco critérios. Cada um vale 0, 1 ou 2 pontos. Brand Statement 2034, metas EOS, 4Fs, cliente e momento, primor gráfico."
            />
            <PassoFluxo
              numero="3"
              titulo="Veredito e roteamento"
              texto="O score total combinado com o critério de primor gráfico determina o canal de saída. Quatro saídas possíveis."
            />
          </ol>
        </section>

        {/* Saídas */}
        <section>
          <Subtitulo numero="02" titulo="AS QUATRO SAÍDAS" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SaidaCard
              titulo="CANAL OFICIAL"
              bg="bg-moss"
              text="text-bone"
              descricao="Score 8 a 10, com primor gráfico mínimo. Vai pro ar nos canais oficiais. Case completo: site, social, asterisco, PR, newsletter, materiais comerciais."
            />
            <SaidaCard
              titulo="CANAL DIRETO"
              bg="bg-ink"
              text="text-bone"
              descricao="Score 5 a 7, ou score alto sem primor gráfico. Vai por ABM, e-mail segmentado, deck comercial, conteúdo restrito. Não entra em Brand Publishing."
            />
            <SaidaCard
              titulo="ROTEAMENTO"
              bg="bg-ember"
              text="text-bone"
              descricao="Domínio falhou ou score 3 a 4. Demanda é legítima mas o setor competente é outro. Encaminha com nota de contexto. Brand & MKT entra só como guardrail se solicitado."
            />
            <SaidaCard
              titulo="RECUSA"
              bg="bg-paper"
              text="text-ink"
              borderClass="border border-ember"
              descricao="Gate violado ou score 0 a 2. Resposta com fundamento explicando quais critérios não foram atendidos. Sugere alternativa quando houver."
            />
          </div>
        </section>

        {/* Gates */}
        <section>
          <Subtitulo numero="03" titulo="FILTROS EM DETALHE" />
          <div className="space-y-6">
            {GATES.map((g) => (
              <DetalheItem
                key={g.id}
                titulo={g.titulo}
                pergunta={g.pergunta}
                explicacao={g.explicacao.base}
              />
            ))}
          </div>
        </section>

        {/* Score */}
        <section>
          <Subtitulo numero="04" titulo="SCORE EM DETALHE" />
          <div className="space-y-6">
            {SCORES.map((s) => (
              <DetalheItem
                key={s.id}
                titulo={s.titulo}
                pergunta={s.pergunta}
                explicacao={s.explicacao.base}
                opcoes={s.opcoes.map((op) => `${op.valor} · ${op.label}`)}
              />
            ))}
          </div>
        </section>

        {/* Referências */}
        <section>
          <Subtitulo numero="05" titulo="REFERÊNCIAS" />
          <div className="space-y-10">
            <div className="bg-paper border border-line rounded-2xl p-7 shadow-card">
              <p className="text-[10px] uppercase tracking-widest text-ash mb-4">
                Brand Statement 2034
              </p>
              <p className="italic font-display text-2xl leading-snug tracking-wide text-ink/90">
                {BRAND_STATEMENT}
              </p>
            </div>

            <div className="bg-paper border border-line rounded-2xl p-7 shadow-card">
              <p className="text-[10px] uppercase tracking-widest text-ash mb-4">
                Metas EOS
              </p>
              <ul className="space-y-4">
                {METAS_Q2.map((m) => (
                  <li key={m.numero} className="text-ink/85 leading-relaxed">
                    <span className="font-display text-xl tracking-wide text-ink block mb-1">
                      META {m.numero} · {m.titulo.toUpperCase()}
                    </span>
                    {m.descricao}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-paper border border-line rounded-2xl p-7 shadow-card">
              <p className="text-[10px] uppercase tracking-widest text-ash mb-4">
                Os 4Fs
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUATRO_FS.map((f) => (
                  <li key={f.letra}>
                    <p className="font-display text-2xl tracking-wide text-ink mb-1">
                      {f.letra.toUpperCase()}
                    </p>
                    <p className="text-sm text-ink/75 leading-relaxed">
                      {f.descricao}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </article>

      <footer className="mx-auto max-w-4xl px-6 md:px-10 mt-24 pt-6 border-t border-line">
        <Link
          href="/"
          className="lift inline-block px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-semibold text-ink bg-paper border border-line hover:border-ink transition"
        >
          ← Voltar para o filtro
        </Link>
      </footer>
    </main>
  );
}

function Subtitulo({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="font-mono text-xs text-ash tabular-nums">{numero}</span>
      <h2 className="font-display text-4xl tracking-wide text-ink">{titulo}</h2>
    </div>
  );
}

function PassoFluxo({
  numero,
  titulo,
  texto,
}: {
  numero: string;
  titulo: string;
  texto: string;
}) {
  return (
    <li className="bg-paper border border-line rounded-2xl p-6 shadow-card flex gap-5 items-start">
      <span className="font-display text-5xl tracking-wide text-ember leading-none">
        {numero}
      </span>
      <div>
        <h3 className="font-display text-2xl tracking-wide text-ink mb-2">
          {titulo.toUpperCase()}
        </h3>
        <p className="text-sm text-ink/75 leading-relaxed">{texto}</p>
      </div>
    </li>
  );
}

function SaidaCard({
  titulo,
  bg,
  text,
  borderClass,
  descricao,
}: {
  titulo: string;
  bg: string;
  text: string;
  borderClass?: string;
  descricao: string;
}) {
  return (
    <div
      className={`${bg} ${text} ${borderClass ?? ""} rounded-2xl p-6 shadow-veredito`}
    >
      <p className="font-display text-3xl tracking-wide mb-3 leading-tight">
        {titulo}
      </p>
      <p className="text-sm leading-relaxed opacity-90">{descricao}</p>
    </div>
  );
}

function DetalheItem({
  titulo,
  pergunta,
  explicacao,
  opcoes,
}: {
  titulo: string;
  pergunta: string;
  explicacao: string;
  opcoes?: string[];
}) {
  return (
    <div className="bg-paper border border-line rounded-2xl p-6 shadow-card">
      <h3 className="font-display text-2xl tracking-wide text-ink mb-2">
        {titulo.toUpperCase()}
      </h3>
      <p className="text-sm text-ash mb-3 leading-relaxed">{pergunta}</p>
      <p className="text-sm text-ink/80 leading-relaxed">{explicacao}</p>
      {opcoes && (
        <ul className="mt-4 space-y-1 text-xs text-ash font-mono">
          {opcoes.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
