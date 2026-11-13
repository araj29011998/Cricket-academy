import React, { useMemo, useState } from 'react';
import {
  Crosshair,
  Plus,
  RotateCcw,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import {
  DeliveryOutcome,
  DeliveryRecord,
  LengthZone,
  LineZone,
  TelemetryMode,
} from '../types/academy';

const OUTCOMES: ('All' | DeliveryOutcome)[] = ['All', 'Wicket', 'Boundary', 'Single', 'Dot'];
const LENGTH_ZONES: ('All' | LengthZone)[] = ['All', 'Yorker', 'Full', 'Good', 'Short', 'Bouncer'];

function classifyLengthZone(yPct: number): LengthZone {
  if (yPct < 18) return 'Yorker';
  if (yPct < 33) return 'Full';
  if (yPct < 54) return 'Good';
  if (yPct < 76) return 'Short';
  return 'Bouncer';
}

function classifyLineZone(xPct: number): LineZone {
  if (xPct < 33) return 'Outside Off';
  if (xPct < 45) return 'Off Stump';
  if (xPct < 56) return 'Middle';
  return 'Leg Stump';
}

function classifyShotType(angleDeg: number, distancePct: number): string {
  if (distancePct < 32) return 'Defensive Push';
  if (angleDeg >= 335 || angleDeg < 25) return 'Straight Drive';
  if (angleDeg >= 25 && angleDeg < 80) return 'Cover Drive';
  if (angleDeg >= 80 && angleDeg < 125) return 'Square Cut';
  if (angleDeg >= 125 && angleDeg < 175) return 'Late Cut / Guide';
  if (angleDeg >= 175 && angleDeg < 215) return 'Fine Glance';
  if (angleDeg >= 215 && angleDeg < 260) return 'Wrist Flick';
  if (angleDeg >= 260 && angleDeg < 305) return 'Pull Shot';
  return 'On Drive';
}

function getOutcomeMarkerColors(outcome: DeliveryOutcome): {
  fill: string;
  stroke: string;
  badgeText: string;
  badgeBg: string;
} {
  switch (outcome) {
    case 'Wicket':
      return {
        fill: '#d92d20',
        stroke: '#ffffff',
        badgeText: 'text-[#ffb4a8]',
        badgeBg: 'bg-[#93000a]/45 border-[#d92d20]',
      };
    case 'Boundary':
      return {
        fill: '#f59e0b',
        stroke: '#061f13',
        badgeText: 'text-[#f59e0b]',
        badgeBg: 'bg-[#4b2d00]/45 border-[#f59e0b]/60',
      };
    case 'Single':
      return {
        fill: '#a1d2b1',
        stroke: '#061f13',
        badgeText: 'text-[#a1d2b1]',
        badgeBg: 'bg-[#0b3b24] border-[#a1d2b1]/40',
      };
    case 'Dot':
    default:
      return {
        fill: '#cbd5e1',
        stroke: '#081425',
        badgeText: 'text-slate-200',
        badgeBg: 'bg-[#1e293b] border-slate-600/60',
      };
  }
}

export const TelemetryView: React.FC = () => {
  const {
    athletes,
    selectedAthleteId,
    setSelectedAthleteId,
    deliveries,
    addDelivery,
    resetTelemetry,
  } = useAcademy();

  const [mode, setMode] = useState<TelemetryMode>('bowling');
  const [lengthFilter, setLengthFilter] = useState<'All' | LengthZone>('All');
  const [outcomeFilter, setOutcomeFilter] = useState<'All' | DeliveryOutcome>('All');
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  // New Delivery / Shot Log Form State
  const [draftPitchX, setDraftPitchX] = useState<number>(38);
  const [draftPitchY, setDraftPitchY] = useState<number>(38);
  const [draftAngleDeg, setDraftAngleDeg] = useState<number>(60);
  const [draftDistPct, setDraftDistPct] = useState<number>(86);
  const [draftSpeed, setDraftSpeed] = useState<string>('138.5');
  const [draftSecondaryMetric, setDraftSecondaryMetric] = useState<string>('1820');
  const [draftOutcome, setDraftOutcome] = useState<DeliveryOutcome>('Dot');
  const [draftShotType, setDraftShotType] = useState<string>('Cover Drive');

  const selectedAthlete = useMemo(
    () => athletes.find((a) => a.id === selectedAthleteId) ?? athletes[0],
    [athletes, selectedAthleteId]
  );

  // Switch secondary metric default nicely when changing mode
  const handleModeChange = (nextMode: TelemetryMode) => {
    setMode(nextMode);
    setInspectedId(null);
    if (nextMode === 'bowling') {
      setDraftSpeed(selectedAthlete.role === 'Spin Bowler' ? '89.5' : '138.5');
      setDraftSecondaryMetric(selectedAthlete.role === 'Spin Bowler' ? '2350' : '1820');
    } else {
      setDraftSpeed('134.0');
      setDraftSecondaryMetric('138');
    }
  };

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) => {
      if (d.athleteId !== selectedAthlete.id) return false;
      if (d.mode !== mode) return false;
      if (lengthFilter !== 'All' && d.lengthZone !== lengthFilter) return false;
      if (outcomeFilter !== 'All' && d.outcome !== outcomeFilter) return false;
      return true;
    });
  }, [deliveries, selectedAthlete.id, mode, lengthFilter, outcomeFilter]);

  const inspectedDelivery: DeliveryRecord | null = useMemo(() => {
    if (inspectedId) {
      return filteredDeliveries.find((d) => d.id === inspectedId) ?? null;
    }
    return filteredDeliveries[0] ?? null;
  }, [filteredDeliveries, inspectedId]);

  const summaryStats = useMemo(() => {
    if (filteredDeliveries.length === 0) {
      return {
        count: 0,
        peakSpeed: 0,
        avgSpeed: 0,
        avgSecondary: 0,
        wicketsOrBoundaries: 0,
      };
    }
    const peakSpeed = Math.max(...filteredDeliveries.map((d) => d.speedKmh));
    const avgSpeed =
      filteredDeliveries.reduce((acc, d) => acc + d.speedKmh, 0) / filteredDeliveries.length;
    const avgSecondary =
      filteredDeliveries.reduce((acc, d) => acc + d.spinRpmOrExitVelo, 0) /
      filteredDeliveries.length;
    const wicketsOrBoundaries = filteredDeliveries.filter((d) =>
      mode === 'bowling' ? d.outcome === 'Wicket' : d.outcome === 'Boundary'
    ).length;

    return {
      count: filteredDeliveries.length,
      peakSpeed: Number(peakSpeed.toFixed(1)),
      avgSpeed: Number(avgSpeed.toFixed(1)),
      avgSecondary: Math.round(avgSecondary),
      wicketsOrBoundaries,
    };
  }, [filteredDeliveries, mode]);

  const lengthBreakdown = useMemo(() => {
    const zones: LengthZone[] = ['Yorker', 'Full', 'Good', 'Short', 'Bouncer'];
    const total = filteredDeliveries.length || 1;
    return zones.map((zone) => {
      const count = filteredDeliveries.filter((d) => d.lengthZone === zone).length;
      return {
        zone,
        count,
        pct: filteredDeliveries.length === 0 ? 0 : Math.round((count / total) * 100),
      };
    });
  }, [filteredDeliveries]);

  const handlePitchSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isLogging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    // Map pitch region inside SVG viewBox (pitch strip is roughly x: 18..82, y: 12..88)
    const normalizedX = Math.max(8, Math.min(92, Math.round(((rawX - 18) / 64) * 100)));
    const normalizedY = Math.max(4, Math.min(96, Math.round(((rawY - 12) / 76) * 100)));
    setDraftPitchX(normalizedX);
    setDraftPitchY(normalizedY);
  };

  const handleWagonSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isLogging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;
    const maxRadius = Math.min(cx, cy) * 0.86;
    const dist = Math.min(100, Math.max(18, Math.round((Math.hypot(dx, dy) / maxRadius) * 100)));
    let angle = Math.round((Math.atan2(dx, -dy) * 180) / Math.PI);
    if (angle < 0) angle += 360;
    setDraftAngleDeg(angle);
    setDraftDistPct(dist);
    setDraftShotType(classifyShotType(angle, dist));
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSpeed = Math.max(55, Math.min(165, Number(draftSpeed) || 132));
    const parsedSec = Math.max(60, Math.min(3200, Number(draftSecondaryMetric) || 1800));

    addDelivery({
      athleteId: selectedAthlete.id,
      mode,
      speedKmh: Number(parsedSpeed.toFixed(1)),
      spinRpmOrExitVelo: Math.round(parsedSec),
      pitchX: draftPitchX,
      pitchY: draftPitchY,
      lengthZone: classifyLengthZone(draftPitchY),
      lineZone: classifyLineZone(draftPitchX),
      shotAngleDeg: draftAngleDeg,
      shotDistancePct: draftDistPct,
      shotType: mode === 'batting' ? draftShotType : draftOutcome === 'Wicket' ? 'Dismissal Ball' : 'Net Delivery',
      outcome: draftOutcome,
    });
    setIsLogging(false);
  };

  const resetFilters = () => {
    setLengthFilter('All');
    setOutcomeFilter('All');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-700/50">
        <div>
          <p className="font-label text-xs font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
            Hawk-Lane Performance Telemetry
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight mt-1">
            Batting &amp; Bowling Pitch Tracker
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            {selectedAthlete.name} · {selectedAthlete.cohort} Squad · {selectedAthlete.role} (
            {selectedAthlete.bowlingArm})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Discipline Mode Toggle */}
          <div className="inline-flex p-1 bg-[#081425] border border-slate-700/60 rounded">
            <button
              type="button"
              onClick={() => handleModeChange('bowling')}
              className={`px-3.5 py-2 font-label text-xs font-bold uppercase tracking-[0.06em] rounded-sm transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'bowling'
                  ? 'bg-[#0b3b24] text-[#f59e0b] border border-[#f59e0b]/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Bowling Pitch Map
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('batting')}
              className={`px-3.5 py-2 font-label text-xs font-bold uppercase tracking-[0.06em] rounded-sm transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'batting'
                  ? 'bg-[#0b3b24] text-[#f59e0b] border border-[#f59e0b]/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Batting Wagon Wheel
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsLogging((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-colors whitespace-nowrap cursor-pointer ${
              isLogging
                ? 'bg-[#f59e0b] text-[#061f13]'
                : 'bg-[#d92d20] hover:bg-[#b42318] text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{isLogging ? 'Cancel Logging' : mode === 'bowling' ? 'Log Delivery' : 'Log Shot'}</span>
          </button>
        </div>
      </div>

      {/* Athlete Selector & Filter Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#081425] border border-slate-700/50 rounded p-4">
        <div className="md:col-span-4">
          <label
            htmlFor="telemetry-athlete"
            className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400 mb-1"
          >
            Active Athlete
          </label>
          <select
            id="telemetry-athlete"
            value={selectedAthlete.id}
            onChange={(e) => {
              setSelectedAthleteId(e.target.value);
              setInspectedId(null);
            }}
            className="w-full px-3 py-2 bg-[#1e293b] border border-slate-600/70 rounded text-sm text-white focus:outline-none focus:border-[#f59e0b]"
          >
            {athletes.map((ath) => (
              <option key={ath.id} value={ath.id}>
                {ath.name} ({ath.cohort} · {ath.role})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <span className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400 mb-1">
            Length Zone
          </span>
          <div className="flex flex-wrap gap-1.5">
            {LENGTH_ZONES.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => setLengthFilter(zone)}
                className={`px-2.5 py-1.5 rounded font-label text-[11px] font-bold uppercase tracking-[0.04em] transition-colors cursor-pointer ${
                  lengthFilter === zone
                    ? 'bg-[#0b3b24] text-[#f59e0b] border border-[#f59e0b]/60'
                    : 'bg-[#1e293b] text-slate-300 border border-slate-700/50 hover:text-white'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="flex-1">
            <span className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400 mb-1">
              Outcome Filter
            </span>
            <div className="flex flex-wrap gap-1.5">
              {OUTCOMES.map((out) => (
                <button
                  key={out}
                  type="button"
                  onClick={() => setOutcomeFilter(out)}
                  className={`px-2.5 py-1.5 rounded font-label text-[11px] font-bold uppercase tracking-[0.04em] transition-colors cursor-pointer ${
                    outcomeFilter === out
                      ? 'bg-[#d92d20] text-white border border-[#d92d20]'
                      : 'bg-[#1e293b] text-slate-300 border border-slate-700/50 hover:text-white'
                  }`}
                >
                  {out}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={resetTelemetry}
            title="Restore default seeded deliveries"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-600/80 text-slate-300 hover:text-white hover:border-white rounded font-label text-[11px] font-bold uppercase tracking-[0.04em] transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Main Telemetry Grid: Interactive Pitch / Wagon Wheel + Live Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Interactive Visualization Canvas */}
        <div className="lg:col-span-7 bg-[#081425] border border-slate-700/50 rounded p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-white uppercase tracking-wide">
                {mode === 'bowling'
                  ? '22-Yard Pitch Bounce & Channel Map'
                  : '360° Wagon Wheel Shot Dispersion'}
              </h2>
              <p className="text-xs text-slate-300">
                {isLogging
                  ? mode === 'bowling'
                    ? 'Click anywhere on the pitch surface to set ball bounce coordinates.'
                    : 'Click anywhere inside the boundary ring to place the shot trajectory.'
                  : 'Click any plotted marker to inspect exact speed, spin, and zone telemetry.'}
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-label font-semibold uppercase text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d92d20] border border-white" />
                Wicket
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                Boundary
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a1d2b1]" />
                Single
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                Dot
              </span>
            </div>
          </div>

          {mode === 'bowling' ? (
            /* 22-Yard Interactive Pitch SVG */
            <div className="relative bg-[#061f13] border border-slate-700/50 rounded p-3">
              <svg
                viewBox="0 0 400 480"
                onClick={handlePitchSvgClick}
                className={`w-full max-h-[470px] mx-auto select-none ${
                  isLogging ? 'cursor-crosshair' : ''
                }`}
                role="img"
                aria-label="Interactive cricket pitch bounce map"
              >
                {/* Outfield surround */}
                <rect x="0" y="0" width="400" height="480" rx="4" fill="#061f13" />
                {/* Pitch turf strip */}
                <rect
                  x="72"
                  y="56"
                  width="256"
                  height="368"
                  rx="2"
                  fill="#0b3b24"
                  stroke="#a1d2b1"
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />

                {/* Length Zone Bands (top = batter stumps / yorker, bottom = bowler / bouncer) */}
                {/* Yorker 0-18% */}
                <rect x="72" y="56" width="256" height="66" fill="#d92d20" fillOpacity="0.08" />
                {/* Full 18-33% */}
                <rect x="72" y="122" width="256" height="55" fill="#f59e0b" fillOpacity="0.06" />
                {/* Good 33-54% */}
                <rect x="72" y="177" width="256" height="77" fill="#a1d2b1" fillOpacity="0.11" />
                {/* Short 54-76% */}
                <rect x="72" y="254" width="256" height="81" fill="#1e293b" fillOpacity="0.35" />
                {/* Bouncer 76-100% */}
                <rect x="72" y="335" width="256" height="89" fill="#081425" fillOpacity="0.4" />

                {/* Zone Divider Hairlines */}
                {[122, 177, 254, 335].map((yPos) => (
                  <line
                    key={yPos}
                    x1="72"
                    y1={yPos}
                    x2="328"
                    y2={yPos}
                    stroke="#94a3b8"
                    strokeOpacity="0.25"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Lateral Stump Channels */}
                <line x1="156" y1="56" x2="156" y2="424" stroke="#94a3b8" strokeOpacity="0.2" />
                <line x1="200" y1="56" x2="200" y2="424" stroke="#f59e0b" strokeOpacity="0.3" />
                <line x1="244" y1="56" x2="244" y2="424" stroke="#94a3b8" strokeOpacity="0.2" />

                {/* Popping Crease & Bowling Crease (Batter End at Top) */}
                <line x1="56" y1="56" x2="344" y2="56" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" />
                <line x1="48" y1="88" x2="352" y2="88" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2" />
                {/* Return creases */}
                <line x1="72" y1="36" x2="72" y2="88" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5" />
                <line x1="328" y1="36" x2="328" y2="88" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5" />

                {/* Batter Stumps */}
                {[186, 200, 214].map((sx) => (
                  <g key={sx}>
                    <circle cx={sx} cy="52" r="3.5" fill="#f59e0b" />
                    <line x1={sx} y1="34" x2={sx} y2="52" stroke="#f59e0b" strokeWidth="2.5" />
                  </g>
                ))}
                {/* Bails */}
                <line x1="186" y1="34" x2="214" y2="34" stroke="#ffffff" strokeWidth="2" />

                {/* Zone Labels on Left Margin */}
                <text x="14" y="92" fill="#cbd5e1" fontSize="10" fontWeight="700">
                  YORKER
                </text>
                <text x="14" y="152" fill="#f59e0b" fontSize="10" fontWeight="700">
                  FULL
                </text>
                <text x="14" y="218" fill="#a1d2b1" fontSize="10" fontWeight="700">
                  GOOD
                </text>
                <text x="14" y="298" fill="#cbd5e1" fontSize="10" fontWeight="700">
                  SHORT
                </text>
                <text x="14" y="382" fill="#94a3b8" fontSize="10" fontWeight="700">
                  BOUNCER
                </text>

                {/* Channel Headers at Bottom */}
                <text x="108" y="452" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">
                  OUTSIDE OFF
                </text>
                <text x="200" y="452" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">
                  STUMPS CORRIDOR
                </text>
                <text x="292" y="452" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">
                  LEG SIDE
                </text>

                {/* Plotted Deliveries */}
                {filteredDeliveries.map((del) => {
                  const cx = 72 + (del.pitchX / 100) * 256;
                  const cy = 56 + (del.pitchY / 100) * 368;
                  const colors = getOutcomeMarkerColors(del.outcome);
                  const isSelected = inspectedDelivery?.id === del.id;

                  return (
                    <g
                      key={del.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedId(del.id);
                      }}
                      className="cursor-pointer"
                    >
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="13"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeDasharray="3 2"
                        />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 8 : 6.5}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}

                {/* Draft Target Crosshair when Logging */}
                {isLogging && (
                  <g>
                    <circle
                      cx={72 + (draftPitchX / 100) * 256}
                      cy={56 + (draftPitchY / 100) * 368}
                      r="11"
                      fill="#f59e0b"
                      fillOpacity="0.25"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <circle
                      cx={72 + (draftPitchX / 100) * 256}
                      cy={56 + (draftPitchY / 100) * 368}
                      r="3"
                      fill="#ffffff"
                    />
                  </g>
                )}
              </svg>
            </div>
          ) : (
            /* 360° Batting Wagon Wheel SVG */
            <div className="relative bg-[#061f13] border border-slate-700/50 rounded p-3">
              <svg
                viewBox="0 0 420 420"
                onClick={handleWagonSvgClick}
                className={`w-full max-h-[470px] mx-auto select-none ${
                  isLogging ? 'cursor-crosshair' : ''
                }`}
                role="img"
                aria-label="Interactive cricket batting wagon wheel"
              >
                <rect x="0" y="0" width="420" height="420" rx="4" fill="#061f13" />

                {/* Boundary Rope */}
                <circle
                  cx="210"
                  cy="210"
                  r="180"
                  fill="#0b3b24"
                  stroke="#ffffff"
                  strokeOpacity="0.55"
                  strokeWidth="2"
                />
                {/* 30-Yard Inner Ring */}
                <circle
                  cx="210"
                  cy="210"
                  r="95"
                  fill="none"
                  stroke="#a1d2b1"
                  strokeOpacity="0.35"
                  strokeDasharray="5 5"
                  strokeWidth="1.5"
                />

                {/* Radial Sector Lines */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const x2 = 210 + Math.sin(rad) * 180;
                  const y2 = 210 - Math.cos(rad) * 180;
                  return (
                    <line
                      key={deg}
                      x1="210"
                      y1="210"
                      x2={x2}
                      y2={y2}
                      stroke="#94a3b8"
                      strokeOpacity="0.18"
                    />
                  );
                })}

                {/* Center Pitch Strip */}
                <rect
                  x="198"
                  y="170"
                  width="24"
                  height="80"
                  rx="2"
                  fill="#1e293b"
                  stroke="#f59e0b"
                  strokeOpacity="0.5"
                />
                {/* Batter Marker at Crease */}
                <circle cx="210" cy="210" r="4.5" fill="#ffffff" />

                {/* Field Region Labels */}
                <text x="210" y="22" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="700">
                  STRAIGHT / LONG OFF
                </text>
                <text x="355" y="95" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">
                  COVER
                </text>
                <text x="385" y="214" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="700">
                  POINT
                </text>
                <text x="342" y="348" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">
                  THIRD MAN
                </text>
                <text x="210" y="408" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">
                  FINE LEG / KEEPER
                </text>
                <text x="68" y="348" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="700">
                  DEEP SQUARE
                </text>
                <text x="35" y="214" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">
                  MID-WICKET
                </text>
                <text x="68" y="95" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="700">
                  LONG ON
                </text>

                {/* Plotted Shot Vectors */}
                {filteredDeliveries.map((del) => {
                  const rad = (del.shotAngleDeg * Math.PI) / 180;
                  const distPx = (del.shotDistancePct / 100) * 180;
                  const x2 = 210 + Math.sin(rad) * distPx;
                  const y2 = 210 - Math.cos(rad) * distPx;
                  const colors = getOutcomeMarkerColors(del.outcome);
                  const isSelected = inspectedDelivery?.id === del.id;

                  return (
                    <g
                      key={del.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedId(del.id);
                      }}
                      className="cursor-pointer"
                    >
                      <line
                        x1="210"
                        y1="210"
                        x2={x2}
                        y2={y2}
                        stroke={colors.fill}
                        strokeWidth={isSelected ? '3.5' : '2.2'}
                        strokeOpacity={isSelected ? '1' : '0.85'}
                      />
                      <circle
                        cx={x2}
                        cy={y2}
                        r={isSelected ? 7 : 5}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}

                {/* Draft Vector when Logging */}
                {isLogging && (
                  <g>
                    <line
                      x1="210"
                      y1="210"
                      x2={210 + Math.sin((draftAngleDeg * Math.PI) / 180) * ((draftDistPct / 100) * 180)}
                      y2={210 - Math.cos((draftAngleDeg * Math.PI) / 180) * ((draftDistPct / 100) * 180)}
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray="5 3"
                    />
                    <circle
                      cx={210 + Math.sin((draftAngleDeg * Math.PI) / 180) * ((draftDistPct / 100) * 180)}
                      cy={210 - Math.cos((draftAngleDeg * Math.PI) / 180) * ((draftDistPct / 100) * 180)}
                      r="7"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Log Delivery Form (if active) OR Live Stats + Inspected Ball */}
        <div className="lg:col-span-5 space-y-5">
          {isLogging && (
            <form
              onSubmit={handleLogSubmit}
              className="bg-[#0b3b24] border border-[#f59e0b]/60 rounded p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-white uppercase">
                  {mode === 'bowling' ? 'Log Tracked Delivery' : 'Log Tracked Batting Shot'}
                </h3>
                <span className="font-label text-[11px] font-bold uppercase text-[#f59e0b]">
                  {mode === 'bowling'
                    ? `${classifyLengthZone(draftPitchY)} · ${classifyLineZone(draftPitchX)}`
                    : `${draftShotType} · ${draftAngleDeg}°`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="log-speed"
                    className="block font-label text-[11px] font-bold uppercase tracking-[0.05em] text-slate-200 mb-1"
                  >
                    Ball Speed (km/h)
                  </label>
                  <input
                    id="log-speed"
                    type="number"
                    step="0.1"
                    min="55"
                    max="165"
                    value={draftSpeed}
                    onChange={(e) => setDraftSpeed(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1e293b] border border-slate-600 rounded text-sm text-white tabular-nums focus:outline-none focus:border-[#f59e0b]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="log-secondary"
                    className="block font-label text-[11px] font-bold uppercase tracking-[0.05em] text-slate-200 mb-1"
                  >
                    {mode === 'bowling' ? 'Spin / Seam (RPM)' : 'Exit Velocity (km/h)'}
                  </label>
                  <input
                    id="log-secondary"
                    type="number"
                    step="1"
                    min="60"
                    max="3200"
                    value={draftSecondaryMetric}
                    onChange={(e) => setDraftSecondaryMetric(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1e293b] border border-slate-600 rounded text-sm text-white tabular-nums focus:outline-none focus:border-[#f59e0b]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="log-outcome"
                    className="block font-label text-[11px] font-bold uppercase tracking-[0.05em] text-slate-200 mb-1"
                  >
                    Outcome
                  </label>
                  <select
                    id="log-outcome"
                    value={draftOutcome}
                    onChange={(e) => setDraftOutcome(e.target.value as DeliveryOutcome)}
                    className="w-full px-3 py-2 bg-[#1e293b] border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-[#f59e0b]"
                  >
                    <option value="Dot">Dot Ball</option>
                    <option value="Single">Single / Rotation</option>
                    <option value="Boundary">Boundary (4 / 6)</option>
                    <option value="Wicket">Wicket</option>
                  </select>
                </div>

                {mode === 'batting' ? (
                  <div>
                    <label
                      htmlFor="log-shot-type"
                      className="block font-label text-[11px] font-bold uppercase tracking-[0.05em] text-slate-200 mb-1"
                    >
                      Shot Classification
                    </label>
                    <input
                      id="log-shot-type"
                      type="text"
                      value={draftShotType}
                      onChange={(e) => setDraftShotType(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1e293b] border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-[#f59e0b]"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-end">
                    <span className="text-xs text-slate-300 leading-snug">
                      Click the pitch map on the left to adjust bounce coordinates.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLogging(false)}
                  className="px-4 py-2 border border-slate-500 text-slate-200 hover:text-white rounded font-label text-xs font-bold uppercase tracking-[0.05em] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d92d20] hover:bg-[#b42318] text-white rounded font-label text-xs font-bold uppercase tracking-[0.08em] cursor-pointer"
                >
                  Save to Telemetry
                </button>
              </div>
            </form>
          )}

          {/* Scoreboard Metric Summary (3 key stats) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0b3b24] border border-slate-700/50 rounded p-4">
              <div className="flex items-center justify-between text-[#f59e0b]">
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.06em]">
                  Peak Pace
                </span>
                <Zap className="w-3.5 h-3.5" />
              </div>
              <p className="font-display text-3xl font-bold text-white tabular-nums mt-1">
                {summaryStats.peakSpeed}
              </p>
              <span className="text-[11px] text-slate-300">km/h recorded</span>
            </div>

            <div className="bg-[#0b3b24] border border-slate-700/50 rounded p-4">
              <div className="flex items-center justify-between text-[#a1d2b1]">
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.06em]">
                  {mode === 'bowling' ? 'Avg Seam RPM' : 'Avg Exit Velo'}
                </span>
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <p className="font-display text-3xl font-bold text-white tabular-nums mt-1">
                {summaryStats.avgSecondary}
              </p>
              <span className="text-[11px] text-slate-300">
                {mode === 'bowling' ? 'rev / min' : 'km/h off bat'}
              </span>
            </div>

            <div className="bg-[#0b3b24] border border-slate-700/50 rounded p-4">
              <div className="flex items-center justify-between text-[#ffb4a8]">
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.06em]">
                  {mode === 'bowling' ? 'Wickets' : 'Boundaries'}
                </span>
                <Target className="w-3.5 h-3.5" />
              </div>
              <p className="font-display text-3xl font-bold text-white tabular-nums mt-1">
                {summaryStats.wicketsOrBoundaries}
              </p>
              <span className="text-[11px] text-slate-300 tabular-nums">
                of {summaryStats.count} balls
              </span>
            </div>
          </div>

          {/* Inspected Ball / Shot Telemetry Readout */}
          <div className="bg-[#081425] border border-slate-700/50 rounded p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#f59e0b]" />
                <h3 className="font-label text-xs font-bold uppercase tracking-[0.08em] text-white">
                  Selected Delivery Inspection
                </h3>
              </div>
              {inspectedDelivery && (
                <span className="text-xs text-slate-400 tabular-nums">
                  Logged {inspectedDelivery.timestamp}
                </span>
              )}
            </div>

            {inspectedDelivery ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-700/40">
                <div>
                  <span className="block text-[11px] text-slate-400">Ball Speed</span>
                  <span className="font-display text-xl font-bold text-white tabular-nums">
                    {inspectedDelivery.speedKmh} km/h
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">
                    {mode === 'bowling' ? 'Rev Rate' : 'Exit Velocity'}
                  </span>
                  <span className="font-display text-xl font-bold text-[#f59e0b] tabular-nums">
                    {inspectedDelivery.spinRpmOrExitVelo}{' '}
                    {mode === 'bowling' ? 'RPM' : 'km/h'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">
                    {mode === 'bowling' ? 'Pitch Zone' : 'Shot Type'}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {mode === 'bowling'
                      ? `${inspectedDelivery.lengthZone} · ${inspectedDelivery.lineZone}`
                      : inspectedDelivery.shotType}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Outcome</span>
                  <span
                    className={`inline-block mt-0.5 px-2 py-0.5 rounded border text-[11px] font-label font-bold uppercase ${
                      getOutcomeMarkerColors(inspectedDelivery.outcome).badgeBg
                    } ${getOutcomeMarkerColors(inspectedDelivery.outcome).badgeText}`}
                  >
                    {inspectedDelivery.outcome}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-2">
                No deliveries match the active filter combination.
              </p>
            )}
          </div>

          {/* Length Consistency Breakdown */}
          <div className="bg-[#081425] border border-slate-700/50 rounded p-5 space-y-3">
            <h3 className="font-label text-xs font-bold uppercase tracking-[0.08em] text-white">
              Length Zone Distribution
            </h3>
            <div className="space-y-2.5">
              {lengthBreakdown.map((item) => (
                <div key={item.zone} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{item.zone}</span>
                    <span className="text-slate-300 tabular-nums">
                      {item.count} balls ({item.pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-[#1e293b] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#f59e0b] transition-all duration-200"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ball-by-Ball Telemetry Ledger Table */}
      <div className="bg-[#081425] border border-slate-700/50 rounded overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-display text-xl font-semibold text-white uppercase tracking-wide">
            Session Delivery Ledger
          </h3>
          <span className="text-xs text-slate-400 tabular-nums">
            Showing {filteredDeliveries.length} tracked{' '}
            {mode === 'bowling' ? 'deliveries' : 'shots'}
          </span>
        </div>

        {filteredDeliveries.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm text-slate-300">
              No {mode} telemetry records found for {selectedAthlete.name} under the current
              filters.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 border border-slate-600 text-white hover:border-[#f59e0b] rounded font-label text-xs font-bold uppercase tracking-[0.06em] cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setIsLogging(true)}
                className="px-4 py-2 bg-[#d92d20] hover:bg-[#b42318] text-white rounded font-label text-xs font-bold uppercase tracking-[0.06em] cursor-pointer"
              >
                Log First Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b3b24]/70 border-b border-slate-700/60 font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-300">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Length Zone</th>
                  <th className="py-3 px-4">Line / Shot</th>
                  <th className="py-3 px-4 text-right">Speed (km/h)</th>
                  <th className="py-3 px-4 text-right">
                    {mode === 'bowling' ? 'Spin (RPM)' : 'Exit Velo (km/h)'}
                  </th>
                  <th className="py-3 px-4">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {filteredDeliveries.map((del) => {
                  const colors = getOutcomeMarkerColors(del.outcome);
                  const isSelected = inspectedDelivery?.id === del.id;
                  return (
                    <tr
                      key={del.id}
                      onClick={() => setInspectedId(del.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#0b3b24]/50' : 'hover:bg-[#1e293b]/50'
                      }`}
                    >
                      <td className="py-3 px-4 text-slate-300 tabular-nums">{del.timestamp}</td>
                      <td className="py-3 px-4 font-medium text-white">{del.lengthZone}</td>
                      <td className="py-3 px-4 text-slate-200">
                        {mode === 'bowling' ? del.lineZone : del.shotType}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-white tabular-nums">
                        {del.speedKmh.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-200 tabular-nums">
                        {del.spinRpmOrExitVelo}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded border text-[11px] font-label font-bold uppercase ${colors.badgeBg} ${colors.badgeText}`}
                        >
                          {del.outcome}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
