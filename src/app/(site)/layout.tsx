import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "../globals.css";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
