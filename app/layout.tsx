import type { Metadata } from "next";
import localFont from "next/font/local";
import { QueryProvider } from "@/components/provider/query-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const font = localFont({
  src: "./fonts/Outfit-Variable.ttf",
  variable: "--font-outfit",
  display: "swap",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: { default: "Mali System — Génie logiciel", template: "%s | Mali System" },
  description: "Solutions RHPaie, TimeSheet, RHData et RHFacture pour la gestion de la paie et des ressources humaines.",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <QueryProvider>
          <Toaster richColors position="top-center" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
