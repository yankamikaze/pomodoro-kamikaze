import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pomodoro Kamikaze",
  description: "Sistema de organização de estudos baseado no Método Pomodoro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased min-h-screen bg-gray-950 text-gray-50 flex flex-col">
        {children}
      </body>
    </html>
  );
}
