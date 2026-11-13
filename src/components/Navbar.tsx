import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { AppView } from '../types/academy';

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'telemetry', label: 'Telemetry' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'programs', label: 'Programs' },
];

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, openBookingModal } = useAcademy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#061f13]/95 backdrop-blur-sm border-b border-slate-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('overview')}
          className="font-display text-2xl font-bold tracking-wider text-white uppercase whitespace-nowrap shrink-0 hover:text-[#f59e0b] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59e0b]"
        >
          APEX CRICKET
        </button>

        {/* Zone 2: 4 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`font-label text-xs font-bold uppercase tracking-[0.08em] py-2 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59e0b] ${
                  isActive
                    ? 'text-[#f59e0b] border-[#f59e0b]'
                    : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA button + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openBookingModal()}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-all duration-150 hover:-translate-y-0.5 shadow-[0_6px_18px_-4px_rgba(217,45,32,0.5)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book Trial
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded border border-slate-700/60 bg-[#0b3b24] text-white hover:border-[#f59e0b] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#081425] border-b border-slate-700/50 px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded font-label text-xs font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0b3b24] text-[#f59e0b] border border-[#f59e0b]/40'
                    : 'text-slate-200 hover:bg-[#0b3b24]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openBookingModal();
            }}
            className="w-full mt-2 px-4 py-3 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-xs font-bold uppercase tracking-[0.08em] rounded cursor-pointer"
          >
            Book Trial
          </button>
        </div>
      )}
    </header>
  );
};
