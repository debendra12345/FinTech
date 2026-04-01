'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Apply initial theme synchronously to avoid flash
  return <>{children}</>;
}
