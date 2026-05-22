'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Home,
  LogOut,
  Settings,
  Users,
  Heart,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Children',
    href: '/children',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Recommendations',
    href: '/recommendations',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center group-hover:shadow-lg transition-all">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Posyandu</h1>
            <p className="text-xs text-sidebar-foreground/60">Health Monitor</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {user && (
        <div className="p-6 border-t border-sidebar-border space-y-4">
          <div className="px-4 py-3 bg-sidebar-accent/10 rounded-lg">
            <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Logged in as
            </p>
            <p className="font-medium mt-1">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60 mt-1">{user.role === 'admin' ? 'Administrator' : 'Kader'}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
