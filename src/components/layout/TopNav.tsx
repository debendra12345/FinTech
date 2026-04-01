'use client';

import { Menu, Sun, Moon, ChevronDown, Shield, Eye } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import type { UserRole } from '@/types';

interface TopNavProps {
  onMenuClick: () => void;
  pageTitle: string;
}

const roles: { value: UserRole; label: string; icon: typeof Shield }[] = [
  { value: 'admin', label: 'Admin', icon: Shield },
  { value: 'viewer', label: 'Viewer', icon: Eye },
];

export function TopNav({ onMenuClick, pageTitle }: TopNavProps) {
  const { role, setRole, theme, toggleTheme } = useAppStore();
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRoleOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const currentRole = roles.find((r) => r.value === role) ?? roles[0];
  const CurrentIcon = currentRole.icon;

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="theme-toggle"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Role switcher */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            id="role-switcher"
            className={cn(
              'flex items-center gap-2 h-9 rounded-xl border px-3 text-sm font-medium transition-all duration-200',
              'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              role === 'admin'
                ? 'border-primary/30 text-primary bg-primary/5'
                : 'border-border text-muted-foreground bg-transparent'
            )}
          >
            <CurrentIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{currentRole.label}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', isRoleOpen && 'rotate-180')} />
          </button>

          {isRoleOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-border bg-popover shadow-xl overflow-hidden z-50">
              {roles.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => { setRole(value); setIsRoleOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors',
                    value === role
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  {value === role && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm cursor-pointer">
          <span className="text-xs font-bold text-white">JD</span>
        </div>
      </div>
    </header>
  );
}
