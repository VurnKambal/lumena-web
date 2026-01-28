import { Inter } from "next/font/google";
import { FinanceProvider } from "@/context/FinanceContext";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Lumena",
  description: "Variable-income financial app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-slate-50`}>
        <FinanceProvider>
          <AppShell>
             {children}
          </AppShell>
        </FinanceProvider>
      </body>
    </html>
  );
}
