'use client';

import { Sun, Moon, ChevronDown, Shield, Eye, Menu } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import type { UserRole } from '@/types';

interface TopNavProps {
  onMenuClick: () => void;
  pageTitle: string;
}

export function TopNav({ onMenuClick, pageTitle }: TopNavProps) {
  const { role, setRole, theme, toggleTheme } = useAppStore();
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const isAdmin = role === 'admin';

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 flex items-center gap-4">
        {/* Mobile menu */}
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden -ml-1" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" id="theme-toggle" className="text-muted-foreground hover:text-foreground">
            {theme === 'dark'
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />}
          </Button>

          {/* Role switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="role-switcher"
              onClick={() => setIsRoleOpen(p => !p)}
              className={cn(
                'flex items-center gap-2 h-8 rounded-xl border px-3 text-xs font-semibold transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isAdmin
                  ? 'border-primary/40 text-primary bg-primary/8 hover:bg-primary/12'
                  : 'border-amber-500/40 text-amber-400 bg-amber-500/8 hover:bg-amber-500/12',
              )}
            >
              {isAdmin
                ? <Shield className="h-3.5 w-3.5" />
                : <Eye className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isAdmin ? 'Admin' : 'Viewer'}</span>
              <ChevronDown className={cn('h-3 w-3 transition-transform duration-200 hidden sm:block', isRoleOpen && 'rotate-180')} />
            </button>

            {isRoleOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-popover shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-1">
                    Switch Role
                  </p>
                </div>
                {([
                  {
                    value: 'admin' as UserRole,
                    label: 'Admin',
                    desc: 'Full read & write access',
                    icon: Shield,
                    color: 'text-primary',
                    bg: 'bg-primary/10',
                  },
                  {
                    value: 'viewer' as UserRole,
                    label: 'Viewer',
                    desc: 'Read-only, no mutations',
                    icon: Eye,
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/10',
                  },
                ] as const).map(({ value, label, desc, icon: Icon, color, bg }) => (
                  <button
                    key={value}
                    onClick={() => { setRole(value); setIsRoleOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                      value === role ? `${bg}` : 'hover:bg-accent',
                    )}
                  >
                    <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center', bg)}>
                      <Icon className={cn('h-3.5 w-3.5', color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-semibold', value === role ? color : 'text-foreground')}>
                        {label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{desc}</p>
                    </div>
                    {value === role && (
                      <div className={cn('h-1.5 w-1.5 rounded-full shrink-0', value === 'admin' ? 'bg-primary' : 'bg-amber-400')} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm cursor-pointer select-none">
            <span className="text-[10px] font-bold text-white">JD</span>
          </div>
        </div>
      </div>

      {/* Viewer mode indicator bar */}
      {!isAdmin && (
        <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
      )}
    </header>
  );
}
