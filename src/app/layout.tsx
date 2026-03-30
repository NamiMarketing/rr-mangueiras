import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RR Mangueiras",
  description: "RR Mangueiras - Conexões Hidráulicas e Industrial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={figtree.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
