import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ReiconTerminal, ReiconRadar, ReiconAtsDoc } from '@/components/icons/Reicon';

export const MobileBottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#E2E8E5] z-40 px-6 flex items-center justify-around safe-bottom shadow-lg shadow-black/[0.03]">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors',
            isActive ? 'text-[#008855] font-bold' : 'text-neutral-500 hover:text-[#0A1A12]'
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
            isActive ? 'text-[#008855] font-bold' : 'text-neutral-500 hover:text-[#0A1A12]'
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
            isActive ? 'text-[#008855] font-bold' : 'text-neutral-500 hover:text-[#0A1A12]'
          )
        }
      >
        <ReiconAtsDoc size={20} strokeWidth={1.75} className="mb-0.5" />
        <span>Resume</span>
      </NavLink>
    </nav>
  );
};
