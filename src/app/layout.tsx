import type { Metadata } from "next";
import { Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RR Mangueiras",
  description: "RR Mangueiras - Conexões Hidráulicas e Industrial",
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={figtree.className}>
        {children}
      </body>
    </html>
  );
}

