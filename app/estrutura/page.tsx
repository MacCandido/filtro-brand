import Link from "next/link";
import {
  GATES,
  SCORES,
  QUATRO_FS,
  METAS_Q2,
  BRAND_STATEMENT,
} from "@/lib/criteria";

export const metadata = {
  title: "Como funciona — Filtro de Demandas Tátil",
};

export default function EstruturaPage() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-12 md:py-14">
      <header className="mx-auto max-w-4xl mb-12">
        <Link
          href="/"
          className="text-xs uppercase tracking-wider text-ash hover:text-ink transition"
        >
          ← Voltar para o filtro
        </Link>
        <p className="text-xs uppercase tracking-[0.25em] text-ash mb-2 mt-6">
          Brand, Marketing & Comunicação
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
          Como funciona o filtro
        </h1>
        <p className="mt-4 text-base text-ash leading-relaxed max-w-2xl">
          A árvore decide se a demanda entra no setor, em qual canal sai, ou
          para qual outro setor deve ser encaminhada. Três camadas, em ordem.
        </p>
      </header>

      <article className="mx-auto max-w-4xl space-y-16">
        {/* Fluxo geral */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-ink">O fluxo</h2>
          <ol className="space-y-5 text-ink/90 leading-relaxed">
            <li>
              <p className="font-medium text-ink">
                1. Filtros eliminatórios.
              </p>
              <p className="text-ash text-sm mt-1">
                Três perguntas em ordem. Qualquer não viola o gate e leva a
                recusa ou roteamento. Conflito de portfólio, janela de
                execução, e domínio do setor.
              </p>
            </li>
            <li>
              <p className="font-medium text-ink">2. Score estratégico.</p>
              <p className="text-ash text-sm mt-1">
                Cinco critérios. Cada um vale 0, 1 ou 2 pontos. Brand Statement
                2034, metas EOS, 4Fs, cliente e momento, primor gráfico.
              </p>
            </li>
            <li>
              <p className="font-medium text-ink">3. Veredito e roteamento.</p>
              <p className="text-ash text-sm mt-1">
                O score total combinado com o critério de primor gráfico
                determina o canal de saída. Quatro saídas possíveis.
              </p>
            </li>
          </ol>
        </section>

        {/* Saídas */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-ink">As quatro saídas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-moss text-bone p-5">
              <p className="font-serif text-2xl mb-2">Canal oficial</p>
              <p className="text-sm leading-relaxed opacity-90">
                Score 8 a 10, com primor gráfico mínimo. Vai pro ar nos canais
                oficiais. Case completo: site, social, asterisco, PR,
                newsletter, materiais comerciais.
              </p>
            </div>
            <div className="bg-ink text-bone p-5">
              <p className="font-serif text-2xl mb-2">Canal direto</p>
              <p className="text-sm leading-relaxed opacity-90">
                Score 5 a 7, ou score alto sem primor gráfico. Vai por ABM,
                e-mail segmentado, deck comercial, conteúdo restrito. Não entra
                em Brand Publishing.
              </p>
            </div>
            <div className="bg-ember text-bone p-5">
              <p className="font-serif text-2xl mb-2">
                Roteia para outro setor
              </p>
              <p className="text-sm leading-relaxed opacity-90">
                G3 falhou ou score 3 a 4. Demanda é legítima mas o setor
                competente é outro. Encaminha com nota de contexto. Brand & MKT
                entra só como guardrail se solicitado.
              </p>
            </div>
            <div className="bg-bone border border-ember p-5">
              <p className="font-serif text-2xl mb-2 text-ink">
                Recusa formal
              </p>
              <p className="text-sm leading-relaxed text-ink/80">
                Gate violado ou score 0 a 2. Resposta com fundamento explicando
                quais critérios não foram atendidos. Sugere alternativa quando
                houver.
              </p>
            </div>
          </div>
        </section>

        {/* Gates detalhados */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-ink">
            Filtros eliminatórios em detalhe
          </h2>
          <div className="space-y-6">
            {GATES.map((g) => (
              <div
                key={g.id}
                className="border-l-2 border-ink/30 pl-5 space-y-2"
              >
                <h3 className="font-medium text-ink">{g.titulo}</h3>
                <p className="text-sm text-ash leading-relaxed">{g.pergunta}</p>
                <p className="text-sm text-ink/80 leading-relaxed">
                  {g.explicacao.base}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Score detalhado */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-ink">
            Score estratégico em detalhe
          </h2>
          <div className="space-y-6">
            {SCORES.map((s) => (
              <div
                key={s.id}
                className="border-l-2 border-ink/30 pl-5 space-y-2"
              >
                <h3 className="font-medium text-ink">{s.titulo}</h3>
                <p className="text-sm text-ash leading-relaxed">{s.pergunta}</p>
                <p className="text-sm text-ink/80 leading-relaxed">
                  {s.explicacao.base}
                </p>
                <ul className="text-xs text-ash space-y-1 pt-1">
                  {s.opcoes.map((op) => (
                    <li key={op.valor}>
                      <span className="font-mono">{op.valor}</span> · {op.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Referências */}
        <section className="space-y-8">
          <h2 className="font-serif text-3xl text-ink">Referências</h2>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.25em] text-ash">
              Brand Statement 2034
            </h3>
            <p className="italic text-ink/85 font-serif text-lg leading-relaxed">
              {BRAND_STATEMENT}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.25em] text-ash">
              Metas EOS
            </h3>
            <ul className="space-y-3">
              {METAS_Q2.map((m) => (
                <li key={m.numero} className="text-ink/85 leading-relaxed">
                  <span className="font-medium text-ink">
                    Meta {m.numero}. {m.titulo}.
                  </span>{" "}
                  {m.descricao}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.25em] text-ash">
              Os 4Fs
            </h3>
            <ul className="space-y-2">
              {QUATRO_FS.map((f) => (
                <li key={f.letra} className="text-ink/85 leading-relaxed">
                  <span className="font-medium text-ink">{f.letra}.</span>{" "}
                  {f.descricao}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>

      <footer className="mx-auto max-w-4xl mt-20 pt-6 border-t border-ash/20">
        <Link
          href="/"
          className="text-xs uppercase tracking-wider text-ash hover:text-ink transition"
        >
          ← Voltar para o filtro
        </Link>
      </footer>
    </main>
  );
}
