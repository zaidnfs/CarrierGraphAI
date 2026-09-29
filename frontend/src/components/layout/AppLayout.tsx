import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop & Tablet Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Mobile Header (visible only on small screens) */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-30">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-base text-foreground">
            <div className="h-7 w-7 rounded-md bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>SkillBridge AI</span>
          </NavLink>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              {user?.first_name || user?.email?.split('@')[0]}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-8 w-8 text-muted-foreground"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-[1280px] w-full mx-auto animate-in fade-in-50 duration-300">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};
