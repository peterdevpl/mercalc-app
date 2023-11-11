import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import { ReactNode } from 'react';
import SummaryRoot from '@/components/summaryRoot';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mercalc'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <SummaryRoot>{children}</SummaryRoot>
      </body>
    </html>
  )
}
