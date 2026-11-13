import React from 'react';
import { Award, Check, Users } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { ACADEMY_IMAGES, COACH_FACULTY, PROGRAM_TRACKS } from '../data/seedData';
import { ResilientImage } from './ResilientImage';

export const ProgramsView: React.FC = () => {
  const { openBookingModal } = useAcademy();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* Header */}
      <div className="pb-6 border-b border-slate-700/50 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="font-label text-xs font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
            Structured Athlete Pathways
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight mt-1">
            Academy Programs &amp; Coaching Faculty
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Four progressive cohort tiers designed around age-appropriate workload limits,
            biomechanical milestones, and instrumented net evaluation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openBookingModal()}
          className="px-5 py-3 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-colors self-start lg:self-auto cursor-pointer"
        >
          Book Intake Trial
        </button>
      </div>

      {/* Cohort Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROGRAM_TRACKS.map((track) => (
          <article
            key={track.id}
            className="bg-[#081425] border border-slate-700/50 rounded p-6 sm:p-7 flex flex-col justify-between gap-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-label text-xs font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
                    {track.cohort} · {track.ageRange}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase mt-1">
                    {track.title}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-display text-2xl font-bold text-white tabular-nums">
                    {track.feeMonthly}
                  </span>
                  <span className="block text-[11px] text-slate-400">{track.cadence}</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{track.summary}</p>

              <div className="pt-3 border-t border-slate-700/40 space-y-2.5">
                <span className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-[#a1d2b1]">
                  Curriculum Pillars
                </span>
                <ul className="space-y-2">
                  {track.modules.map((mod) => (
                    <li key={mod} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <Check className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                <Users className="w-4 h-4 text-[#a1d2b1]" />
                {track.squadSize}
              </span>

              <button
                type="button"
                onClick={() => openBookingModal({ defaultCohort: track.cohort })}
                className="px-4 py-2 bg-[#0b3b24] hover:bg-[#134e32] border border-[#a1d2b1]/50 text-white font-label text-xs font-bold uppercase tracking-[0.06em] rounded transition-colors cursor-pointer"
              >
                Apply for {track.cohort}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Specialist Coaching Faculty */}
      <div className="space-y-6">
        <div>
          <span className="font-label text-xs font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
            Performance Leadership
          </span>
          <h2 className="font-display text-3xl font-bold text-white uppercase tracking-tight mt-1">
            Specialist Coaching Faculty
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COACH_FACULTY.map((coach) => (
            <div
              key={coach.id}
              className="bg-[#0b3b24] border border-slate-700/50 rounded overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#081425]">
                <ResilientImage
                  src={coach.imageSrc ?? ACADEMY_IMAGES.headCoach}
                  alt={`${coach.name}, ${coach.role}`}
                  className="w-full h-full object-cover"
                  fallbackLabel={coach.name}
                />
              </div>
              <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-label font-bold uppercase tracking-[0.06em] text-[#f59e0b]">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{coach.accreditation}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white uppercase">
                    {coach.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#a1d2b1]">{coach.role}</p>
                </div>

                <div className="pt-3 border-t border-slate-700/40 text-xs text-slate-200 space-y-1">
                  <p>{coach.specialty}</p>
                  <p className="text-slate-400 tabular-nums">
                    {coach.experienceYears} years elite coaching experience
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
