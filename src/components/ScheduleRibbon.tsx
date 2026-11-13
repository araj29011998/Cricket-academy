import React from 'react';
import {
  Activity,
  CheckCircle,
  Clock,
  CloudRain,
  Trophy,
  Users,
} from 'lucide-react';
import { NetSession, SessionStatus } from '../types/academy';

interface ScheduleRibbonProps {
  sessions: NetSession[];
  selectedSessionId?: string;
  onSelectSession?: (session: NetSession) => void;
  onReserveSlot?: (session: NetSession) => void;
}

export function getStatusDisplay(status: SessionStatus): {
  label: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  Icon: React.FC<{ className?: string }>;
} {
  switch (status) {
    case 'Net Session Active':
      return {
        label: 'Net Session Active',
        textColor: 'text-[#a1d2b1]',
        borderColor: 'border-[#a1d2b1]/40',
        bgColor: 'bg-[#0b3b24]',
        Icon: Activity,
      };
    case 'High Performance Camp':
      return {
        label: 'High Performance Camp',
        textColor: 'text-[#f59e0b]',
        borderColor: 'border-[#f59e0b]/45',
        bgColor: 'bg-[#4b2d00]/45',
        Icon: Trophy,
      };
    case 'Rain Delay Protocol':
      return {
        label: 'Rain Delay Protocol',
        textColor: 'text-[#ffb4a8]',
        borderColor: 'border-[#d92d20]/60',
        bgColor: 'bg-[#93000a]/30',
        Icon: CloudRain,
      };
    case 'Completed':
      return {
        label: 'Completed',
        textColor: 'text-slate-300',
        borderColor: 'border-slate-600/50',
        bgColor: 'bg-[#1e293b]/70',
        Icon: CheckCircle,
      };
    case 'Scheduled':
    default:
      return {
        label: 'Scheduled',
        textColor: 'text-slate-200',
        borderColor: 'border-slate-600/60',
        bgColor: 'bg-[#1e293b]',
        Icon: Clock,
      };
  }
}

export const ScheduleRibbon: React.FC<ScheduleRibbonProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  onReserveSlot,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="p-8 bg-[#081425] border border-slate-700/40 rounded text-center text-sm text-slate-300">
        No net lanes match the active cohort or status filters.
      </div>
    );
  }

  return (
    <div className="ribbon-scroll flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
      {sessions.map((session) => {
        const statusMeta = getStatusDisplay(session.status);
        const StatusIcon = statusMeta.Icon;
        const isSelected = selectedSessionId === session.id;
        const slotsOpen = session.capacity - session.enrolledCount;
        const canBook =
          slotsOpen > 0 &&
          session.status !== 'Completed' &&
          session.status !== 'Rain Delay Protocol';

        return (
          <div
            key={session.id}
            onClick={() => onSelectSession?.(session)}
            className={`snap-start shrink-0 w-[300px] sm:w-[320px] p-5 rounded border transition-all duration-150 flex flex-col justify-between gap-4 ${
              onSelectSession ? 'cursor-pointer' : ''
            } ${
              isSelected
                ? 'bg-[#0b3b24] border-[#f59e0b]'
                : 'bg-[#081425] border-slate-700/50 hover:border-slate-500'
            }`}
          >
            <div className="space-y-3">
              {/* Lane & Time Header */}
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-lg font-bold text-white uppercase tracking-wide tabular-nums">
                  Lane 0{session.laneNumber}
                </span>
                <span className="font-label text-[11px] font-semibold text-slate-300 tabular-nums">
                  {session.timeRange}
                </span>
              </div>

              {/* Explicit Text + Icon Operational Status */}
              <div
                className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border text-[11px] font-label font-bold uppercase tracking-[0.05em] ${statusMeta.bgColor} ${statusMeta.borderColor} ${statusMeta.textColor}`}
              >
                <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{statusMeta.label}</span>
              </div>

              {/* Session Title & Metadata */}
              <div>
                <h3 className="font-display text-lg font-semibold text-white leading-snug">
                  {session.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-300">
                  {session.cohort} Squad <span aria-hidden="true">·</span> {session.coachName}
                </p>
              </div>
            </div>

            {/* Occupancy & Action Row */}
            <div className="pt-3 border-t border-slate-700/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 tabular-nums">
                <Users className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>
                  {session.enrolledCount}/{session.capacity} athletes
                </span>
              </div>

              {onReserveSlot && canBook ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReserveSlot(session);
                  }}
                  className="px-3 py-1.5 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-[11px] font-bold uppercase tracking-[0.06em] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Reserve Slot
                </button>
              ) : (
                <span className="font-label text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-400 whitespace-nowrap">
                  {session.status === 'Rain Delay Protocol'
                    ? 'Weather Hold'
                    : slotsOpen === 0
                    ? 'Squad Full'
                    : 'Closed'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
