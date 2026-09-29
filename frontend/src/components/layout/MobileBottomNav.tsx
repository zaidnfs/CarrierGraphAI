import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileBottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-t border-border z-40 px-6 flex items-center justify-around safe-bottom">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors',
            isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
          )
        }
      >
        <LayoutDashboard className="h-5 w-5 mb-0.5" />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/jobs"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors',
            isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
          )
        }
      >
        <Briefcase className="h-5 w-5 mb-0.5" />
        <span>Jobs</span>
      </NavLink>

      <NavLink
        to="/resumes"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors',
            isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
          )
        }
      >
        <FileText className="h-5 w-5 mb-0.5" />
        <span>Resume</span>
      </NavLink>
    </nav>
  );
};
