import { Inter } from "next/font/google";
import { FinanceProvider } from "@/context/FinanceContext";
import { Navigation } from "@/components/layout/Navigation";
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
          <div className="md:pl-64 min-h-screen">
             <Navigation />
             <main className="pb-20 md:pb-0">
                {children}
             </main>
          </div>
        </FinanceProvider>
      </body>
    </html>
  );
}
