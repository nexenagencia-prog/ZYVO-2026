import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZYVO — Videoconferência de alta performance',
  description: 'Converse, evolua e alcance resultados em cada reunião.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
