import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LogOut,
  User as UserIcon,
  Palette,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { KoboyoSparkle, KoboyoBrain } from '@/components/icons/Koboyo';
import { ReiconTerminal, ReiconRadar, ReiconAtsDoc } from '@/components/icons/Reicon';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: ReiconTerminal },
  { name: 'Job Explorer', href: '/jobs', icon: ReiconRadar },
  { name: 'Resume Analyzer', href: '/resumes', icon: ReiconAtsDoc },
  {
    name: 'AI Mock Interview',
    href: '/interviews',
    icon: KoboyoBrain,
    disabled: true,
    badge: 'Phase 3',
  },
];

export const DesktopSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-screen sticky top-0 border-r border-neutral-200 dark:border-[rgba(0,162,100,0.2)] bg-white/95 dark:bg-[#060B08]/95 backdrop-blur-md z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-[rgba(0,162,100,0.2)]">
        <NavLink to="/" className="flex items-center gap-2.5 font-bold text-base text-[#004D2F] dark:text-white tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-[rgba(76,214,129,1)] flex items-center justify-center text-[#004D2F] shadow-sm">
            <KoboyoSparkle size={18} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight flex items-center gap-1.5 font-bold">
              SkillBridge <span className="font-mono text-xs text-[#008855] dark:text-[rgba(76,214,129,1)]">AI</span>
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-wider">
              Career GraphRAG
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-wider">
          Platform
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-75"
                title="Available in Phase 3"
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} strokeWidth={1.75} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-1.5 py-0.5 rounded font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-[#EEF7F1] dark:bg-[rgba(0,77,47,0.35)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,136,85,0.25)] dark:border-[rgba(0,162,100,0.35)] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-foreground'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={16} strokeWidth={1.75} />
                <span>{item.name}</span>
              </div>
            </NavLink>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-wider">
          Design System
        </div>

        <NavLink
          to="/design"
          className={({ isActive }) =>
            cn(
              'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all',
              isActive
                ? 'bg-[#EEF7F1] dark:bg-[rgba(0,77,47,0.35)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,136,85,0.25)] dark:border-[rgba(0,162,100,0.35)]'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-foreground'
            )
          }
        >
          <div className="flex items-center gap-3">
            <Palette size={16} />
            <span>Design Showcase</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[rgba(0,136,85,0.1)] text-[#004D2F] dark:text-[rgba(76,214,129,1)]">
            Active
          </span>
        </NavLink>
      </nav>

      {/* User profile & Logout footer */}
      <div className="p-3 border-t border-neutral-200 dark:border-[rgba(0,162,100,0.2)] bg-[#F8FAF8] dark:bg-[#050D08]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#09150E] border border-neutral-200 dark:border-[rgba(0,162,100,0.25)] shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-[rgba(0,136,85,0.12)] text-[#004D2F] dark:bg-[rgba(76,214,129,0.2)] dark:text-[rgba(76,214,129,1)] flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              {user?.first_name ? user.first_name[0].toUpperCase() : <UserIcon className="h-4 w-4" />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate font-mono">{user?.email}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Log out"
            className="h-8 w-8 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};
