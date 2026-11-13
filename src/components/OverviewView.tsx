import React from 'react';
import { ArrowRight, BarChart3, CalendarClock, ShieldCheck } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { ACADEMY_IMAGES, COACH_FACULTY } from '../data/seedData';
import { ResilientImage } from './ResilientImage';
import { ScheduleRibbon } from './ScheduleRibbon';

export const OverviewView: React.FC = () => {
  const { setActiveView, openBookingModal, sessions, deliveries, athletes } = useAcademy();

  const peakSpeed = Math.max(...athletes.map((a) => a.peakSpeedKmh), 142.4).toFixed(1);
  const activeCount = sessions.filter(
    (s) => s.status === 'Net Session Active' || s.status === 'High Performance Camp'
  ).length;

  const headCoach = COACH_FACULTY[0];

  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#081425] border border-slate-700/50 rounded p-7 sm:p-10">
            <div className="space-y-5">
              <p className="font-label text-xs font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
                High-Performance Cricket Academy
              </p>

              <h1 className="font-display text-4xl sm:text-5xl xl:text-[3.5rem] font-bold text-white uppercase leading-[1.06] tracking-tight">
                Precision Coaching. Telemetry-Driven Cricket.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Train across six floodlit net lanes equipped with ball-by-ball speed radar, pitch
                bounce mapping, and 360-degree wagon-wheel analytics for U-13 through Senior Elite
                athletes.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="px-6 py-3.5 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-all duration-150 hover:-translate-y-0.5 shadow-[0_8px_20px_-4px_rgba(217,45,32,0.5)] whitespace-nowrap cursor-pointer"
                >
                  Book Assessment Trial
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('telemetry')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/15 font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Open Pitch Telemetry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
              <span>420 Oval Drive Facility</span>
              <span aria-hidden="true">·</span>
              <span>ECB &amp; CA Level 3–4 Faculty</span>
              <span aria-hidden="true">·</span>
              <span>Six Instrumented Lanes</span>
            </div>
          </div>

          {/* Right Hero Photography */}
          <div className="lg:col-span-6 relative rounded overflow-hidden border border-slate-700/50 min-h-[320px] lg:min-h-[440px]">
            <ResilientImage
              src={ACADEMY_IMAGES.heroStadium}
              alt="Floodlit six-lane cricket training pavilion and turf nets at twilight"
              className="w-full h-full object-cover"
              fallbackLabel="Apex Six-Lane Floodlit Facility"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061f13]/90 via-[#061f13]/25 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between gap-4">
              <div>
                <span className="font-label text-[11px] font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
                  Live Evening Block
                </span>
                <p className="font-display text-2xl font-semibold text-white uppercase">
                  {activeCount} Active Net Sessions Running
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('schedule')}
                className="px-4 py-2 bg-[#0b3b24]/90 hover:bg-[#0b3b24] border border-[#a1d2b1]/50 text-white font-label text-[11px] font-bold uppercase tracking-[0.06em] rounded whitespace-nowrap cursor-pointer"
              >
                View Lanes
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Scoreboard Metric Strip */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b3b24] border border-slate-700/50 rounded p-5">
            <span className="font-label text-[11px] font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
              Peak Pace Tracked
            </span>
            <p className="font-display text-4xl sm:text-5xl font-bold text-white tabular-nums mt-1">
              {peakSpeed}
            </p>
            <span className="text-xs text-slate-300 mt-1 block">km/h radar verified</span>
          </div>

          <div className="bg-[#0b3b24] border border-slate-700/50 rounded p-5">
            <span className="font-label text-[11px] font-bold uppercase tracking-[0.08em] text-[#a1d2b1]">
              Squad Retention
            </span>
            <p className="font-display text-4xl sm:text-5xl font-bold text-white tabular-nums mt-1">
              98%
            </p>
            <span className="text-xs text-slate-300 mt-1 block">Annual cohort continuity</span>
          </div>

          <div className="bg-[#0b3b24] border border-slate-700/50 rounded p-5">
            <span className="font-label text-[11px] font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
              Instrumented Lanes
            </span>
            <p className="font-display text-4xl sm:text-5xl font-bold text-white tabular-nums mt-1">
              06
            </p>
            <span className="text-xs text-slate-300 mt-1 block">
              Hybrid turf &amp; indoor cages
            </span>
          </div>

          <div className="bg-[#0b3b24] border border-slate-700/50 rounded p-5">
            <span className="font-label text-[11px] font-bold uppercase tracking-[0.08em] text-[#a1d2b1]">
              Deliveries Logged
            </span>
            <p className="font-display text-4xl sm:text-5xl font-bold text-white tabular-nums mt-1">
              {2452 + deliveries.length}
            </p>
            <span className="text-xs text-slate-300 mt-1 block">
              Ball-by-ball pitch records
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Live Academy Schedule Ribbon Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#f59e0b]">
              <CalendarClock className="w-4 h-4" />
              <span className="font-label text-xs font-bold uppercase tracking-[0.08em]">
                Academy Schedule Ribbon
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white uppercase tracking-tight mt-1">
              Live Net Lane Operations
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('schedule')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-600 hover:border-[#f59e0b] text-white font-label text-xs font-bold uppercase tracking-[0.06em] rounded transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Open Full Schedule Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ScheduleRibbon
          sessions={sessions}
          onSelectSession={() => setActiveView('schedule')}
          onReserveSlot={(session) =>
            openBookingModal({
              linkedSessionId: session.id,
              linkedLaneLabel: `Lane 0${session.laneNumber} · ${session.timeRange}`,
              defaultCohort: session.cohort,
            })
          }
        />
      </section>

      {/* Section 3: Batting & Bowling Telemetry Hub Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#081425] border border-slate-700/50 rounded p-6 sm:p-10">
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2 text-[#f59e0b]">
              <BarChart3 className="w-4 h-4" />
              <span className="font-label text-xs font-bold uppercase tracking-[0.08em]">
                Telemetry &amp; Biomechanics
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight">
              Every Delivery Mapped to the Millimeter
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Analyze bowling length zones from yorker to bouncer across off, middle, and leg
              channels, or switch to the 360-degree wagon wheel to review batting exit velocity and
              scoring arcs.
            </p>

            <ul className="space-y-2.5 text-sm text-slate-200">
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#a1d2b1] shrink-0" />
                <span>Interactive 22-yard pitch bounce heatmap &amp; channel breakdown</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#a1d2b1] shrink-0" />
                <span>Click-to-log live delivery speed, spin RPM, and batting outcomes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#a1d2b1] shrink-0" />
                <span>Athlete-by-athlete session ledger with tabular speed sorting</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveView('telemetry')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-colors cursor-pointer"
              >
                <span>Launch Pitch &amp; Wagon Wheel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative rounded overflow-hidden border border-slate-700/50 aspect-[4/3]">
              <ResilientImage
                src={ACADEMY_IMAGES.bowlingAnalysis}
                alt="Fast bowler release mechanics during evening telemetry session"
                className="w-full h-full object-cover"
                fallbackLabel="Pace Release Biomechanics"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061f13]/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
                  Bowling Lab
                </span>
                <p className="font-display text-lg font-semibold text-white uppercase">
                  Seam &amp; Length Precision
                </p>
              </div>
            </div>

            <div className="relative rounded overflow-hidden border border-slate-700/50 aspect-[4/3]">
              <ResilientImage
                src={ACADEMY_IMAGES.battingCage}
                alt="Batter executing a cover drive on floodlit synthetic academy turf"
                className="w-full h-full object-cover"
                fallbackLabel="Batting Strike Zone"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061f13]/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.08em] text-[#a1d2b1]">
                  Batting Cage
                </span>
                <p className="font-display text-lg font-semibold text-white uppercase">
                  Wagon Wheel &amp; Exit Velocity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Head Coach & Academy Pathways Anchor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b3b24] border border-slate-700/50 rounded p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 aspect-square rounded overflow-hidden border border-slate-700/60 max-w-[280px] mx-auto md:mx-0 w-full">
            <ResilientImage
              src={headCoach.imageSrc ?? ACADEMY_IMAGES.headCoach}
              alt={`${headCoach.name}, ${headCoach.role}`}
              className="w-full h-full object-cover"
              fallbackLabel={headCoach.name}
            />
          </div>

          <div className="md:col-span-8 space-y-4">
            <span className="font-label text-xs font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
              {headCoach.accreditation} · {headCoach.experienceYears} Years Coaching
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight">
              Led by {headCoach.name} &amp; Specialist Staff
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              &ldquo;Telemetry never replaces coach intuition—it sharpens it. Within three net
              sessions, every athlete sees exactly where their good-length corridor sits and how
              footwork affects bat speed through the V.&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveView('programs')}
                className="px-5 py-2.5 border border-white text-white hover:bg-white/10 font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-colors cursor-pointer"
              >
                Explore Cohort Programs
              </button>
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="px-5 py-2.5 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-colors cursor-pointer"
              >
                Schedule Assessment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
