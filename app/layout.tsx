import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Filtro de Demandas — Brand & MKT Tátil",
  description:
    "Decision tree de entrada de demandas e projetos do setor de Brand, Marketing & Comunicação da Tátil. Valida contra Brand Statement 2034, EOS Q2 2026 e 4Fs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
