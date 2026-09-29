import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ReiconTerminal, ReiconRadar, ReiconAtsDoc } from '@/components/icons/Reicon';

export const MobileBottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#060B08]/95 backdrop-blur-md border-t border-neutral-200 dark:border-[rgba(0,162,100,0.2)] z-40 px-6 flex items-center justify-around safe-bottom">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors',
            isActive ? 'text-[#004D2F] dark:text-[rgba(76,214,129,1)] font-bold' : 'text-neutral-500 dark:text-neutral-400'
          )
        }
      >
        <ReiconTerminal size={20} strokeWidth={1.75} className="mb-0.5" />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/jobs"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors',
            isActive ? 'text-[#004D2F] dark:text-[rgba(76,214,129,1)] font-bold' : 'text-neutral-500 dark:text-neutral-400'
          )
        }
      >
        <ReiconRadar size={20} strokeWidth={1.75} className="mb-0.5" />
        <span>Jobs</span>
      </NavLink>

      <NavLink
        to="/resumes"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors',
            isActive ? 'text-[#004D2F] dark:text-[rgba(76,214,129,1)] font-bold' : 'text-neutral-500 dark:text-neutral-400'
          )
        }
      >
        <ReiconAtsDoc size={20} strokeWidth={1.75} className="mb-0.5" />
        <span>Resume</span>
      </NavLink>
    </nav>
  );
};
