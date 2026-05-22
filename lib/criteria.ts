// Critérios do filtro de demandas da área de Brand, Marketing & Comunicação.
// Toda explicação aqui referencia Brand Statement 2034, EOS Q2 2026 e 4Fs.
// Mudanças no corpus de orientação entram aqui.

export type GateAnswer = "sim" | "nao" | "peso" | null;
export type ScoreValue = 0 | 1 | 2 | null;

export type GateId = "g1" | "g2" | "g3";
export type ScoreId = "c1" | "c2" | "c3" | "c4" | "c5";

export interface GateDefinition {
  id: GateId;
  numero: number;
  titulo: string;
  pergunta: string;
  opcoes: {
    valor: Exclude<GateAnswer, null>;
    label: string;
    interpretacao: "passa" | "bloqueia" | "intermediario";
  }[];
  explicacao: {
    base: string;
    porValor: Partial<Record<Exclude<GateAnswer, null>, string>>;
  };
}

export interface ScoreDefinition {
  id: ScoreId;
  numero: number;
  titulo: string;
  pergunta: string;
  opcoes: { valor: 0 | 1 | 2; label: string }[];
  explicacao: {
    base: string;
    porValor: Record<0 | 1 | 2, string>;
  };
}

export const GATES: GateDefinition[] = [
  {
    id: "g1",
    numero: 1,
    titulo: "Conflito de portfólio",
    pergunta:
      "Existe NDA, sigilo, ou cliente concorrente de maior peso comercial que impeça publicizar essa demanda?",
    opcoes: [
      { valor: "nao", label: "Não, está livre", interpretacao: "passa" },
      { valor: "sim", label: "Sim, há bloqueio", interpretacao: "bloqueia" },
      {
        valor: "peso",
        label: "Há conflito, mas o cliente da demanda tem mais peso comercial",
        interpretacao: "intermediario",
      },
    ],
    explicacao: {
      base: "A Meta 1 do EOS Q2 é Suporte à Receita Recorrente em R$ 31M. Carteira mantida está acima de case novo publicado. Conflito de portfólio é gate, não score.",
      porValor: {
        nao: "Caminho livre. Segue para janela de execução.",
        sim: "Sigilo derrubado significa contrato em risco. Duas opções: absorver internamente sem case público, ou recusar formalmente. Não vai pro ar.",
        peso: "Caso clássico do Nubank vs Caixa, da Juliete vs Natura. Validar com Pedro antes de seguir, porque envolve decisão de portfólio comercial.",
      },
    },
  },
  {
    id: "g2",
    numero: 2,
    titulo: "Janela de execução",
    pergunta:
      "Conseguimos entregar com o cliente até a data de lançamento dele, em no máximo 2 meses entre kick-off e ar?",
    opcoes: [
      { valor: "sim", label: "Sim, a janela bate", interpretacao: "passa" },
      { valor: "nao", label: "Não bate", interpretacao: "bloqueia" },
    ],
    explicacao: {
      base: "Case envelhecido não vira ativo de PR nem entra em premiação internacional. A Meta 2 do EOS (Posicionamento Digital) exige cases vivos para gerar lead qualificado.",
      porValor: {
        sim: "Janela viável. Segue.",
        nao: "Natura Ecos é a referência citada pela Luiza. Super relevante na época, hoje não vira mais case. Recusa fundamentada.",
      },
    },
  },
  {
    id: "g3",
    numero: 3,
    titulo: "Domínio do setor",
    pergunta:
      "É demanda de marca, comunicação, brand publishing, conteúdo proprietário, PR ou suporte de marca a Negócios?",
    opcoes: [
      { valor: "sim", label: "Sim, é do nosso setor", interpretacao: "passa" },
      {
        valor: "nao",
        label: "Não, é de outro setor",
        interpretacao: "bloqueia",
      },
    ],
    explicacao: {
      base: "Os Issues 1 e 2 do EOS apontam falta de recurso e clareza de fluxo. Demanda fora de escopo dilui foco e atrasa o que é prioridade do quarter.",
      porValor: {
        sim: "Demanda no nosso terreno. Segue para o score.",
        nao: "Repassar para o setor, equipe ou pessoa responsável.",
      },
    },
  },
];

export const SCORES: ScoreDefinition[] = [
  {
    id: "c1",
    numero: 1,
    titulo: "Brand Statement 2034",
    pergunta:
      "Encarna 'consultoria de design mais original do mundo, craft + tecnologia, alma brasileira'?",
    opcoes: [
      { valor: 0, label: "Não dialoga" },
      { valor: 1, label: "Dialoga lateralmente" },
      { valor: 2, label: "Encarna o statement (entrega BOLD)" },
    ],
    explicacao: {
      base: "O Brand Statement 2034 é a bússola de 10 anos. Toda ação institucional precisa testar contra ele. Pedro foi explícito: o que vai pros canais públicos ativa essa frase.",
      porValor: {
        0: "Sem aderência ao statement. Pontua zero no critério mais pesado da decisão.",
        1: "Dialoga, mas não encarna. Pode ir por canal interno, não por institucional.",
        2: "Encarna o statement. É candidato a canal público e a inscrição em premiação.",
      },
    },
  },
  {
    id: "c2",
    numero: 2,
    titulo: "Metas EOS",
    pergunta: "Quantas das três metas EOS a demanda toca?",
    opcoes: [
      { valor: 0, label: "Nenhuma das três metas" },
      { valor: 1, label: "Toca uma meta" },
      { valor: 2, label: "Toca duas ou três metas" },
    ],
    explicacao: {
      base: "Meta 1: Suporte à Receita Recorrente (R$ 31M). Meta 2: Posicionamento Digital (lead qualificado via canais próprios). Meta 3: Lançamento de Novos Produtos (JV Tátil & Vanto, Videocast AI Leadership). Cada Rock do quarter está amarrado a uma meta ou issue.",
      porValor: {
        0: "Demanda que não toca nenhuma meta entra na fila do depois, não no agora. Risco de dispersão.",
        1: "Aderência mínima ao quarter. Avalia em conjunto com os outros critérios.",
        2: "Demanda alavanca múltiplas metas. Prioridade alta para o quarter.",
      },
    },
  },
  {
    id: "c3",
    numero: 3,
    titulo: "4Fs",
    pergunta: "Quantos dos 4Fs essa demanda ativa?",
    opcoes: [
      { valor: 0, label: "Nenhum ou apenas 1 F" },
      { valor: 1, label: "Ativa 2 Fs" },
      { valor: 2, label: "Ativa 3 ou 4 Fs" },
    ],
    explicacao: {
      base: "Os 4Fs são o filtro oficial declarado no EOS. Fun: energia criativa do time. Fame: notoriedade, prêmio, PR. Fortune: receita, suporte comercial. Future: atualiza a Tátil para o futuro desejável.",
      porValor: {
        0: "Sem ativação relevante dos 4Fs. Não é projeto de vida.",
        1: "Ativação parcial. Decide pelo conjunto.",
        2: "Projeto multi-F. Prioridade clara da casa.",
      },
    },
  },
  {
    id: "c4",
    numero: 4,
    titulo: "Cliente e momento",
    pergunta: "O cliente e o momento dele sustentam narrativa para fora?",
    opcoes: [
      { valor: 0, label: "Cliente menor, momento sem peso" },
      {
        valor: 1,
        label: "Cliente relevante ou momento singular",
      },
      {
        valor: 2,
        label:
          "Cliente enterprise + momento de inflexão (entrada em vertical, IPO, rebranding, fundação)",
      },
    ],
    explicacao: {
      base: "O ICP do Planejamento 2025 é cliente com faturamento acima de R$ 1bi/ano em CPG ou Varejo, em momento de transformação. Cliente fora do ICP pode entrar como 'outras oportunidades', mas não vira case institucional sem momento forte.",
      porValor: {
        0: "Cliente ou momento não sustentam narrativa. Não publicizar.",
        1: "Tem peso suficiente para canal interno e relacionamento. Não necessariamente para canal público.",
        2: "Cliente e momento se combinam. Material rico para PR internacional e premiação.",
      },
    },
  },
  {
    id: "c5",
    numero: 5,
    titulo: "Primor gráfico",
    pergunta:
      "O ativo final terá excelência visual para canal público?",
    opcoes: [
      {
        valor: 0,
        label: "Resultado visual fora do nosso controle ou fraco",
      },
      { valor: 1, label: "Adequado, mas não memorável" },
      {
        valor: 2,
        label: "Excelência gráfica para canal público",
      },
    ],
    explicacao: {
      base: "A Tátil é consultoria de design. Canal público só absorve o que sustenta o padrão visual da casa. Esse critério não derruba a demanda, define o canal de saída.",
      porValor: {
        0: "Sem primor gráfico, o canal público está bloqueado. A demanda pode ir por ABM, e-mail segmentado, deck comercial, mas não vira post de Instagram nem case no site.",
        1: "Visual funciona, mas não memorável. Canal público possível em contexto de volume, não em destaque.",
        2: "Padrão visual íntegro. Canal público liberado.",
      },
    },
  },
];

// Identidade dos 4Fs e Metas, para o box exibir
export const QUATRO_FS = [
  { letra: "Fun", descricao: "energia criativa do time" },
  { letra: "Fame", descricao: "notoriedade, prêmio, PR" },
  { letra: "Fortune", descricao: "receita, suporte comercial" },
  { letra: "Future", descricao: "atualiza a Tátil para o futuro desejável" },
];

export const METAS_Q2 = [
  {
    numero: 1,
    titulo: "Suporte à Receita Recorrente e Relacionamento",
    descricao:
      "Apoiar o comercial a atingir R$ 31M em negócios recorrentes via ABM, deck atualizado e relacionamento com ex-clientes.",
  },
  {
    numero: 2,
    titulo: "Posicionamento Digital",
    descricao:
      "Presença digital e de conteúdo como consultoria de design com viés tech e digital. Videocast AI Leadership Transformation. Lead qualificado pelos canais próprios.",
  },
  {
    numero: 3,
    titulo: "Lançamento de Novos Produtos",
    descricao:
      "Go-to-market das novas verticais. Marca da JV Tátil & Vanto. PR internacional com 5+ publicações até Q4.",
  },
];

export const BRAND_STATEMENT =
  "A Tátil é a consultoria de design e criatividade mais original do mundo. Lideramos a transformação de marcas com excelência, ousadia e alma brasileira. Somos pioneiros em branding e design que alia craft e tecnologia, brilho e precisão. E, acima de tudo, apaixonados pelo que fazemos, pelas relações que construímos e pelos impactos que geramos. Sempre com confiança e colaboração.";
