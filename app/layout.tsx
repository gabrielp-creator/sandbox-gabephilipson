import type { Metadata } from 'next';
import { audiowide, abel } from './lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Sandbox | Gabriel Philipson',
    template: '%s | Gabriel Philipson',
  },
  description: 'Explore live demos of AI projects from the POC Lab.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${audiowide.variable} ${abel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
