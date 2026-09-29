import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  LogOut,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Job Explorer', href: '/jobs', icon: Briefcase },
  { name: 'Resume Analyzer', href: '/resumes', icon: FileText },
  {
    name: 'AI Mock Interview',
    href: '/interviews',
    icon: MessageSquare,
    disabled: true,
    badge: 'Phase 3',
  },
];

export const DesktopSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-screen sticky top-0 border-r border-border bg-card/80 backdrop-blur-md z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/80">
        <NavLink to="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tight">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight">SkillBridge <span className="text-primary font-mono text-sm">AI</span></span>
            <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider">Career GraphRAG</span>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Platform
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/60 cursor-not-allowed opacity-75"
                title="Available in Phase 3"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
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
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile & Logout footer */}
      <div className="p-3 border-t border-border/80 bg-muted/20">
        <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
              {user?.first_name ? user.first_name[0].toUpperCase() : <UserIcon className="h-4 w-4" />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Log out"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};
