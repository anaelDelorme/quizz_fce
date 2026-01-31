import './globals.css';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Quiz Master',
  description: 'Testez vos connaissances et devenez champion !',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans bg-grenat">{children}</body>
    </html>
  );
}
