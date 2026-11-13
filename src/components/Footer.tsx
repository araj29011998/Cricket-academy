import React from 'react';
import { useAcademy } from '../context/AcademyContext';

export const Footer: React.FC = () => {
  const { setActiveView, openBookingModal } = useAcademy();

  return (
    <footer className="bg-[#040e1f] border-t border-slate-700/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-3">
            <span className="font-display text-2xl font-bold tracking-wider text-white uppercase">
              APEX CRICKET
            </span>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              High-performance cricket training center combining Level 3–4 coaching faculty,
              six instrumented net lanes, and ball-by-ball pitch telemetry.
            </p>
            <p className="text-xs text-slate-400">
              High Performance Pavilion · 420 Oval Drive · Open Daily 06:30 – 21:30
            </p>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-label text-xs font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
              Academy Modules
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('overview')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Portal Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('telemetry')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Batting &amp; Bowling Telemetry
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('schedule')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Schedule &amp; Net Lanes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('programs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Programs &amp; Coaching Faculty
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-label text-xs font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
              Player Intake
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Baseline biomechanics assessments run Tuesday through Sunday across Lanes 1–3.
            </p>
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-colors cursor-pointer"
            >
              Book Assessment Trial
            </button>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <span>Apex Cricket Academy · All Squad Cohorts U-13 to Senior Elite</span>
          <span>ECB &amp; CA Aligned Coaching Standards</span>
        </div>
      </div>
    </footer>
  );
};
