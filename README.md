# Filtro de Demandas — Brand & MKT Tátil

Decision tree de entrada de demandas e projetos do setor de Brand, Marketing & Comunicação. Valida contra Brand Statement 2034, EOS Q2 2026 e 4Fs.

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind.

## Rodar local

```bash
npm install
npm run dev
```

## Atualizar critérios

Toda alteração em Brand Statement, metas EOS ou 4Fs entra em `lib/criteria.ts`. A lógica de veredito está em `lib/logic.ts`. O texto exportável em `lib/export.ts`.
