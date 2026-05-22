// Fluxograma SVG da árvore decisória. Estático, sem libs externas.
// Coerente com a paleta e tipografia do filtro.

export default function DecisionTreeViz() {
  return (
    <div className="bg-paper border border-line rounded-2xl p-4 md:p-8 shadow-card overflow-x-auto">
      <div className="min-w-[760px]">
        <svg
          viewBox="0 0 800 1180"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#0a0a0a" />
            </marker>
            <marker
              id="arrowLight"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#6b6b6b" />
            </marker>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#0a0a0a"
                floodOpacity="0.10"
              />
            </filter>
          </defs>

          {/* === ENTRADA === */}
          <NodeRect
            x={250}
            y={20}
            w={300}
            h={60}
            label="DEMANDA CHEGA"
            sub="Início do fluxo"
            kind="entrada"
          />

          {/* Linha entrada → conflito */}
          <Conector path="M400,80 L400,140" />

          {/* === FILTRO 1 === */}
          <NodeRect
            x={250}
            y={140}
            w={300}
            h={80}
            label="CONFLITO DE PORTFÓLIO?"
            sub="NDA, sigilo, cliente concorrente"
            kind="decisao"
          />

          {/* Sim → RECUSA (lateral) */}
          <Conector path="M550,180 L640,180" label="Sim" />
          <NodeRect
            x={640}
            y={150}
            w={160}
            h={60}
            label="RECUSA"
            kind="recusa"
            small
          />

          {/* Conflito → Janela (vertical) */}
          <Conector path="M400,220 L400,300" label="Livre ou peso comercial" />

          {/* === FILTRO 2 === */}
          <NodeRect
            x={250}
            y={300}
            w={300}
            h={80}
            label="JANELA DE EXECUÇÃO?"
            sub="Até 2 meses entre kick-off e ar"
            kind="decisao"
          />

          {/* Não → AVALIAR */}
          <Conector path="M550,340 L640,340" label="Não" />
          <NodeRect
            x={640}
            y={310}
            w={160}
            h={60}
            label="AVALIAR"
            kind="avaliacao"
            small
          />

          {/* Janela → Domínio */}
          <Conector path="M400,380 L400,460" label="Sim" />

          {/* === FILTRO 3 === */}
          <NodeRect
            x={250}
            y={460}
            w={300}
            h={80}
            label="DOMÍNIO DO SETOR?"
            sub="Marca, comunicação, brand publishing"
            kind="decisao"
          />

          {/* Não → REPASSAR */}
          <Conector path="M550,500 L640,500" label="Não" />
          <NodeRect
            x={640}
            y={470}
            w={160}
            h={60}
            label="REPASSAR"
            kind="roteia"
            small
          />

          {/* Domínio → Score */}
          <Conector path="M400,540 L400,620" label="Sim" />

          {/* === SCORE === */}
          <NodeRect
            x={180}
            y={620}
            w={440}
            h={100}
            label="SCORE ESTRATÉGICO"
            sub="Brand Statement · Metas EOS · 4Fs · Cliente · Primor gráfico"
            kind="score"
          />

          {/* Score se ramifica em 4 saídas */}
          {/* Centro do score: 400,720 */}

          {/* Conectores em árvore para 4 saídas */}
          {/* Tronco vertical curto */}
          <Conector path="M400,720 L400,780" />
          {/* Distribuidor horizontal */}
          <path
            d="M120,780 L680,780"
            stroke="#0a0a0a"
            strokeWidth="1.5"
            fill="none"
          />

          {/* 4 ramos descendo para os critérios de score */}
          <Conector path="M120,780 L120,830" />
          <Conector path="M310,780 L310,830" />
          <Conector path="M490,780 L490,830" />
          <Conector path="M680,780 L680,830" />

          {/* === FAIXAS DE SCORE === */}
          <FaixaScore x={40} y={830} label="8 a 10" sub="+ primor gráfico ≥ 1" />
          <FaixaScore
            x={230}
            y={830}
            label="5 a 7"
            sub="ou alto sem primor"
          />
          <FaixaScore x={410} y={830} label="3 a 4" />
          <FaixaScore x={600} y={830} label="0 a 2" />

          {/* Conectores das faixas para saídas */}
          <Conector path="M120,930 L120,990" />
          <Conector path="M310,930 L310,990" />
          <Conector path="M490,930 L490,990" />
          <Conector path="M680,930 L680,990" />

          {/* === SAÍDAS FINAIS === */}
          <NodeRect
            x={40}
            y={990}
            w={160}
            h={140}
            label="CANAL PÚBLICO"
            sub="Site, social, asterisco, PR, newsletter, materiais"
            kind="canalOficial"
            tall
          />
          <NodeRect
            x={230}
            y={990}
            w={160}
            h={140}
            label="CANAL INTERNO"
            sub="ABM, e-mail, deck comercial, conteúdo segmentado"
            kind="canalDireto"
            tall
          />
          <NodeRect
            x={410}
            y={990}
            w={160}
            h={140}
            label="REPASSAR"
            sub="Encaminha para outro setor com nota de contexto"
            kind="roteia"
            tall
          />
          <NodeRect
            x={600}
            y={990}
            w={160}
            h={140}
            label="RECUSA"
            sub="Resposta formal com fundamento. Sugere alternativa"
            kind="recusa"
            tall
          />
        </svg>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 pt-5 border-t border-line text-[10px] uppercase tracking-widest text-ash">
        <LegendaItem cor="bg-moss" label="Canal público" />
        <LegendaItem cor="bg-ink" label="Canal interno" />
        <LegendaItem cor="bg-ember" label="Repassar" />
        <LegendaItem cor="bg-paper" border="border-ember" label="Recusa" />
        <LegendaItem cor="bg-paper" border="border-ash" label="Avaliar" />
        <LegendaItem cor="bg-paper" border="border-line" label="Decisão" />
      </div>
    </div>
  );
}

function NodeRect({
  x,
  y,
  w,
  h,
  label,
  sub,
  kind,
  small,
  tall,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  kind:
    | "entrada"
    | "decisao"
    | "score"
    | "recusa"
    | "roteia"
    | "canalOficial"
    | "canalDireto"
    | "avaliacao";
  small?: boolean;
  tall?: boolean;
}) {
  const styles: Record<
    string,
    { fill: string; stroke: string; text: string; subText: string }
  > = {
    entrada: {
      fill: "#0a0a0a",
      stroke: "#0a0a0a",
      text: "#f5f2ec",
      subText: "rgba(245,242,236,.6)",
    },
    decisao: {
      fill: "#faf8f4",
      stroke: "#0a0a0a",
      text: "#0a0a0a",
      subText: "#6b6b6b",
    },
    score: {
      fill: "#0a0a0a",
      stroke: "#0a0a0a",
      text: "#f5f2ec",
      subText: "rgba(245,242,236,.7)",
    },
    recusa: {
      fill: "#faf8f4",
      stroke: "#c8553d",
      text: "#0a0a0a",
      subText: "#6b6b6b",
    },
    roteia: {
      fill: "#c8553d",
      stroke: "#c8553d",
      text: "#f5f2ec",
      subText: "rgba(245,242,236,.85)",
    },
    canalOficial: {
      fill: "#3a4a3f",
      stroke: "#3a4a3f",
      text: "#f5f2ec",
      subText: "rgba(245,242,236,.85)",
    },
    canalDireto: {
      fill: "#0a0a0a",
      stroke: "#0a0a0a",
      text: "#f5f2ec",
      subText: "rgba(245,242,236,.7)",
    },
    avaliacao: {
      fill: "#faf8f4",
      stroke: "#6b6b6b",
      text: "#0a0a0a",
      subText: "#6b6b6b",
    },
  };
  const s = styles[kind];
  const labelSize = small ? 14 : tall ? 14 : 16;
  const subSize = 10;
  const labelY = sub ? y + h / 2 - (tall ? 36 : 6) : y + h / 2 + 5;

  return (
    <g filter="url(#softShadow)">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        ry={12}
        fill={s.fill}
        stroke={s.stroke}
        strokeWidth={kind === "recusa" ? 1.5 : 0}
      />
      <text
        x={x + w / 2}
        y={labelY}
        textAnchor="middle"
        fontFamily="'Bebas Neue', Impact, sans-serif"
        fontSize={labelSize + (tall ? 4 : small ? 0 : 6)}
        letterSpacing="0.04em"
        fill={s.text}
        dominantBaseline="middle"
      >
        {label}
      </text>
      {sub && (
        <foreignObject
          x={x + 10}
          y={tall ? y + h / 2 - 4 : y + h / 2 + 8}
          width={w - 20}
          height={tall ? h - 60 : 30}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: subSize,
              lineHeight: 1.35,
              textAlign: "center",
              color: s.subText,
            }}
          >
            {sub}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

function Conector({ path, label }: { path: string; label?: string }) {
  // Extrai pontos médios se for linha reta para posicionar label
  return (
    <g>
      <path
        d={path}
        stroke="#0a0a0a"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrow)"
      />
      {label && <ConectorLabel path={path} label={label} />}
    </g>
  );
}

function ConectorLabel({ path, label }: { path: string; label: string }) {
  // Calcula ponto médio do path (assume formato "Mx1,y1 Lx2,y2")
  const match = path.match(/M([\d.-]+),([\d.-]+)\s*L([\d.-]+),([\d.-]+)/);
  if (!match) return null;
  const [, x1, y1, x2, y2] = match.map(Number);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const isVertical = Math.abs(x2 - x1) < Math.abs(y2 - y1);

  return (
    <g>
      <rect
        x={midX - (label.length * 3.5 + 6)}
        y={midY - 8}
        width={label.length * 7 + 12}
        height={16}
        rx={8}
        fill="#f5f2ec"
        stroke="#e3dfd6"
        strokeWidth={1}
      />
      <text
        x={midX}
        y={midY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Space Grotesk', system-ui, sans-serif"
        fontSize={9}
        fontWeight={600}
        letterSpacing="0.1em"
        fill="#6b6b6b"
        style={{ textTransform: "uppercase" }}
      >
        {label}
      </text>
    </g>
  );
}

function FaixaScore({
  x,
  y,
  label,
  sub,
}: {
  x: number;
  y: number;
  label: string;
  sub?: string;
}) {
  return (
    <g filter="url(#softShadow)">
      <rect
        x={x}
        y={y}
        width={160}
        height={100}
        rx={10}
        fill="#faf8f4"
        stroke="#e3dfd6"
        strokeWidth={1}
      />
      <text
        x={x + 80}
        y={y + 38}
        textAnchor="middle"
        fontFamily="'Bebas Neue', Impact, sans-serif"
        fontSize={28}
        letterSpacing="0.04em"
        fill="#0a0a0a"
        dominantBaseline="middle"
      >
        {label}
      </text>
      <text
        x={x + 80}
        y={y + 62}
        textAnchor="middle"
        fontFamily="'Space Grotesk', system-ui, sans-serif"
        fontSize={9}
        letterSpacing="0.14em"
        fill="#6b6b6b"
        style={{ textTransform: "uppercase" }}
        dominantBaseline="middle"
      >
        Pontos
      </text>
      {sub && (
        <foreignObject x={x + 8} y={y + 70} width={144} height={28}>
          <div
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 9,
              lineHeight: 1.3,
              textAlign: "center",
              color: "#6b6b6b",
              fontStyle: "italic",
            }}
          >
            {sub}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

function LegendaItem({
  cor,
  border,
  label,
}: {
  cor: string;
  border?: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block w-3 h-3 rounded ${cor} ${border ?? ""}`}
      />
      <span>{label}</span>
    </div>
  );
}
