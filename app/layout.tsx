import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decision Tree — Brand & MKT Tátil",
  description:
    "Decision tree de entrada de demandas e projetos do setor de Brand, Marketing & Comunicação da Tátil. Valida contra Brand Statement 2034, metas EOS e 4Fs.",
  icons: {
    icon: "/tatil-symbol.png",
  },
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
