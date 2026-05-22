import { Estado, Diagnostico, vereditoLabel } from "./logic";
import { GATES, SCORES } from "./criteria";

export interface DadosDemanda {
  nome: string;
  solicitante: string;
  descricao: string;
}

export function gerarTextoResposta(
  dados: DadosDemanda,
  estado: Estado,
  diagnostico: Diagnostico
): string {
  const linhas: string[] = [];

  linhas.push(`Olá ${dados.solicitante || "[solicitante]"},`);
  linhas.push("");
  linhas.push(
    `Recebemos a demanda "${dados.nome || "[nome da demanda]"}" e validamos contra o Brand Statement 2034, o EOS Q2 2026 da área de Brand, Marketing & Comunicação, e os 4Fs.`
  );
  linhas.push("");
  linhas.push(`Veredito: ${vereditoLabel(diagnostico.veredito)}`);
  linhas.push("");
  linhas.push("Critérios eliminatórios:");
  GATES.forEach((g) => {
    const resp = estado.gates[g.id];
    const opcao = g.opcoes.find((o) => o.valor === resp);
    linhas.push(`- ${g.titulo}: ${opcao?.label ?? "não respondido"}`);
  });
  linhas.push("");
  linhas.push("Score estratégico:");
  SCORES.forEach((s) => {
    const v = estado.scores[s.id];
    linhas.push(`- ${s.titulo}: ${v ?? "—"} de 2`);
  });
  linhas.push(`Score total: ${diagnostico.scoreTotal} de ${diagnostico.scoreMaximo}`);
  linhas.push("");
  linhas.push("Fundamentação:");
  diagnostico.motivos.forEach((m) => linhas.push(`- ${m}`));
  linhas.push("");
  linhas.push(`Próximo passo: ${diagnostico.proximoPasso}`);
  linhas.push("");
  linhas.push("Brand, Marketing & Comunicação — Tátil");
  return linhas.join("\n");
}
