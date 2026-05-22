'use client';

import { useAuth } from '@/contexts/auth-context';
import { Bell, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = document.documentElement.classList.contains('dark');
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground">
          Selamat datang kembali, {user?.name?.split(' ')[0]}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        )}

        {/* Status Indicator */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role === 'admin' ? 'Admin' : 'Kader'}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
