export type AppView = 'overview' | 'telemetry' | 'schedule' | 'programs';

export type CohortTier = 'U-13' | 'U-15' | 'U-17' | 'U-19' | 'Senior';

export type PlayerDiscipline = 'Pace Bowler' | 'Spin Bowler' | 'Top-Order Batter' | 'All-Rounder';

export type TelemetryMode = 'bowling' | 'batting';

export type LengthZone = 'Yorker' | 'Full' | 'Good' | 'Short' | 'Bouncer';

export type LineZone = 'Outside Off' | 'Off Stump' | 'Middle' | 'Leg Stump';

export type DeliveryOutcome = 'Wicket' | 'Boundary' | 'Single' | 'Dot';

export type SessionStatus =
  | 'Net Session Active'
  | 'High Performance Camp'
  | 'Rain Delay Protocol'
  | 'Scheduled'
  | 'Completed';

export interface AthleteProfile {
  id: string;
  name: string;
  cohort: CohortTier;
  role: PlayerDiscipline;
  bowlingArm: 'Right-Arm Fast' | 'Left-Arm Fast' | 'Right-Arm Off-Spin' | 'Left-Arm Orthodox' | 'Part-Time';
  battingHand: 'Right-Handed' | 'Left-Handed';
  peakSpeedKmh: number;
  averageExitVeloKmh: number;
  sessionsCompleted: number;
}

export interface DeliveryRecord {
  id: string;
  athleteId: string;
  mode: TelemetryMode;
  speedKmh: number;
  spinRpmOrExitVelo: number;
  pitchX: number; // 0 (wide outside off) to 100 (leg side)
  pitchY: number; // 0 (stumps / yorker) to 100 (short / bouncer)
  lengthZone: LengthZone;
  lineZone: LineZone;
  shotAngleDeg: number; // 0 = straight down ground (12 o'clock), clockwise
  shotDistancePct: number; // 15 to 100
  shotType: string;
  outcome: DeliveryOutcome;
  timestamp: string;
}

export interface NetSession {
  id: string;
  laneNumber: number;
  title: string;
  cohort: CohortTier;
  coachName: string;
  timeRange: string;
  status: SessionStatus;
  enrolledCount: number;
  capacity: number;
  focusArea: string;
  instrumented: boolean;
}

export interface BookingRecord {
  id: string;
  athleteName: string;
  email: string;
  phone: string;
  cohort: CohortTier;
  discipline: PlayerDiscipline;
  preferredDate: string;
  linkedSessionId?: string;
  linkedLaneLabel?: string;
  notes?: string;
  createdAt: string;
}

export interface ProgramTrack {
  id: string;
  cohort: CohortTier;
  title: string;
  ageRange: string;
  cadence: string;
  feeMonthly: string;
  squadSize: string;
  summary: string;
  modules: string[];
}

export interface CoachProfile {
  id: string;
  name: string;
  role: string;
  accreditation: string;
  specialty: string;
  experienceYears: number;
  imageSrc?: string;
}
