import React, { useMemo, useState } from 'react';
import { CalendarCheck, Filter, ShieldAlert } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { CohortTier, NetSession, SessionStatus } from '../types/academy';
import { getStatusDisplay, ScheduleRibbon } from './ScheduleRibbon';

const COHORT_FILTERS: ('All' | CohortTier)[] = ['All', 'U-13', 'U-15', 'U-17', 'U-19', 'Senior'];
const STATUS_OPTIONS: SessionStatus[] = [
  'Net Session Active',
  'High Performance Camp',
  'Rain Delay Protocol',
  'Scheduled',
  'Completed',
];

export const ScheduleView: React.FC = () => {
  const { sessions, updateSessionStatus, openBookingModal, bookings } = useAcademy();
  const [cohortFilter, setCohortFilter] = useState<'All' | CohortTier>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | SessionStatus>('All');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id ?? '');

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (cohortFilter !== 'All' && s.cohort !== cohortFilter) return false;
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      return true;
    });
  }, [sessions, cohortFilter, statusFilter]);

  const activeLaneCount = useMemo(
    () =>
      sessions.filter(
        (s) => s.status === 'Net Session Active' || s.status === 'High Performance Camp'
      ).length,
    [sessions]
  );

  const rainHoldCount = useMemo(
    () => sessions.filter((s) => s.status === 'Rain Delay Protocol').length,
    [sessions]
  );

  const handleReserve = (session: NetSession) => {
    openBookingModal({
      linkedSessionId: session.id,
      linkedLaneLabel: `Lane 0${session.laneNumber} · ${session.timeRange}`,
      defaultCohort: session.cohort,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Live Operational Summary */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-700/50">
        <div>
          <p className="font-label text-xs font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
            Live Facility Operations
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight mt-1">
            Academy Schedule Ribbon &amp; Net Tracker
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time lane assignments, coach allocations, rain-delay overrides, and direct slot
            reservations across Lanes 1–6.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="px-4 py-2.5 bg-[#0b3b24] border border-slate-700/50 rounded">
            <span className="block font-label text-[10px] font-bold uppercase tracking-[0.06em] text-[#a1d2b1]">
              Active Lanes
            </span>
            <span className="font-display text-2xl font-bold text-white tabular-nums">
              {activeLaneCount} / {sessions.length}
            </span>
          </div>

          <div className="px-4 py-2.5 bg-[#081425] border border-slate-700/50 rounded">
            <span className="block font-label text-[10px] font-bold uppercase tracking-[0.06em] text-[#ffb4a8]">
              Weather Holds
            </span>
            <span className="font-display text-2xl font-bold text-white tabular-nums">
              {rainHoldCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#081425] border border-slate-700/50 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Cohort:
          </span>
          {COHORT_FILTERS.map((cohort) => (
            <button
              key={cohort}
              type="button"
              onClick={() => setCohortFilter(cohort)}
              className={`px-3 py-1.5 rounded font-label text-[11px] font-bold uppercase tracking-[0.05em] transition-colors cursor-pointer ${
                cohortFilter === cohort
                  ? 'bg-[#0b3b24] text-[#f59e0b] border border-[#f59e0b]/60'
                  : 'bg-[#1e293b] text-slate-300 border border-slate-700/50 hover:text-white'
              }`}
            >
              {cohort}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="schedule-status-filter"
            className="font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400 whitespace-nowrap"
          >
            Status:
          </label>
          <select
            id="schedule-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | SessionStatus)}
            className="px-3 py-1.5 bg-[#1e293b] border border-slate-600/70 rounded text-xs text-white focus:outline-none focus:border-[#f59e0b]"
          >
            <option value="All">All Operational States</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal Schedule Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white uppercase tracking-wide">
            Today&apos;s Lane Timeline Ribbon
          </h2>
          <span className="text-xs text-slate-400">
            Click a lane card to inspect or reserve an open slot
          </span>
        </div>

        <ScheduleRibbon
          sessions={filteredSessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={(s) => setSelectedSessionId(s.id)}
          onReserveSlot={handleReserve}
        />
      </div>

      {/* Full Session Tracker Matrix Table */}
      <div className="bg-[#081425] border border-slate-700/50 rounded overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-semibold text-white uppercase tracking-wide">
              Session Control Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Coaches can update lane status directly to broadcast active nets or rain delays.
            </p>
          </div>
          {rainHoldCount > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#93000a]/30 border border-[#d92d20]/60 rounded text-xs text-[#ffb4a8]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Rain Delay Protocol active on {rainHoldCount} outdoor lane</span>
            </div>
          )}
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm text-slate-300">
              No scheduled sessions match the selected cohort and status filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setCohortFilter('All');
                setStatusFilter('All');
              }}
              className="px-4 py-2 border border-slate-600 text-white hover:border-[#f59e0b] rounded font-label text-xs font-bold uppercase tracking-[0.06em] cursor-pointer"
            >
              Reset Schedule Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b3b24]/70 border-b border-slate-700/60 font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-300">
                  <th className="py-3 px-4">Lane</th>
                  <th className="py-3 px-4">Session &amp; Focus</th>
                  <th className="py-3 px-4">Cohort</th>
                  <th className="py-3 px-4">Coach</th>
                  <th className="py-3 px-4">Window</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Operational Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {filteredSessions.map((session) => {
                  const statusMeta = getStatusDisplay(session.status);
                  const StatusIcon = statusMeta.Icon;
                  const slotsLeft = session.capacity - session.enrolledCount;
                  const canBook =
                    slotsLeft > 0 &&
                    session.status !== 'Completed' &&
                    session.status !== 'Rain Delay Protocol';

                  return (
                    <tr
                      key={session.id}
                      className={`transition-colors ${
                        selectedSessionId === session.id
                          ? 'bg-[#0b3b24]/40'
                          : 'hover:bg-[#1e293b]/40'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-display text-base font-bold text-white tabular-nums whitespace-nowrap">
                        Lane 0{session.laneNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{session.title}</div>
                        <div className="text-xs text-slate-400">
                          {session.focusArea}
                          {session.instrumented ? ' · Radar Active' : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-200 whitespace-nowrap">
                        {session.cohort}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 whitespace-nowrap">
                        {session.coachName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 tabular-nums whitespace-nowrap">
                        {session.timeRange}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums whitespace-nowrap">
                        <span className="text-white font-semibold">{session.enrolledCount}</span>
                        <span className="text-slate-400">/{session.capacity}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 shrink-0 ${statusMeta.textColor}`} />
                          <select
                            aria-label={`Change status for Lane ${session.laneNumber}`}
                            value={session.status}
                            onChange={(e) =>
                              updateSessionStatus(session.id, e.target.value as SessionStatus)
                            }
                            className="px-2.5 py-1.5 bg-[#1e293b] border border-slate-600/70 rounded text-xs text-white focus:outline-none focus:border-[#f59e0b]"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {canBook ? (
                          <button
                            type="button"
                            onClick={() => handleReserve(session)}
                            className="px-3.5 py-1.5 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-[11px] font-bold uppercase tracking-[0.06em] rounded transition-colors cursor-pointer"
                          >
                            Reserve ({slotsLeft})
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {session.status === 'Rain Delay Protocol'
                              ? 'Paused'
                              : slotsLeft === 0
                              ? 'Full'
                              : 'Closed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmed User Bookings Ledger (if any) */}
      {bookings.length > 0 && (
        <div className="bg-[#0b3b24] border border-[#f59e0b]/40 rounded p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#f59e0b]" />
            <h3 className="font-display text-xl font-semibold text-white uppercase tracking-wide">
              Your Confirmed Reservations ({bookings.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((bk) => (
              <div
                key={bk.id}
                className="p-4 bg-[#081425] border border-slate-700/50 rounded space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-label font-bold uppercase text-[#f59e0b]">
                    {bk.cohort} · {bk.discipline}
                  </span>
                  <span className="text-slate-400 tabular-nums">{bk.preferredDate}</span>
                </div>
                <p className="font-semibold text-white">{bk.athleteName}</p>
                <p className="text-xs text-slate-300">
                  {bk.linkedLaneLabel ? bk.linkedLaneLabel : 'Baseline Assessment Trial'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
