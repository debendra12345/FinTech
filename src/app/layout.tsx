import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FinFlow – Personal Finance Dashboard',
  description: 'A production-quality personal finance dashboard with real-time insights, transaction management, and smart analytics.',
  keywords: ['finance', 'dashboard', 'budgeting', 'analytics', 'transactions'],
  authors: [{ name: 'FinFlow' }],
  openGraph: {
    title: 'FinFlow – Personal Finance Dashboard',
    description: 'Track your finances with style',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: 'white' },
              },
              error: {
                iconTheme: { primary: '#f43f5e', secondary: 'white' },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
