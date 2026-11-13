import React, { createContext, useContext, useEffect, useState } from 'react';
import { SEED_ATHLETES, SEED_DELIVERIES, SEED_SESSIONS } from '../data/seedData';
import {
  AppView,
  AthleteProfile,
  BookingRecord,
  CohortTier,
  DeliveryRecord,
  NetSession,
  PlayerDiscipline,
  SessionStatus,
} from '../types/academy';

interface BookingModalOptions {
  isOpen: boolean;
  linkedSessionId?: string;
  linkedLaneLabel?: string;
  defaultCohort?: CohortTier;
}

interface NewBookingInput {
  athleteName: string;
  email: string;
  phone: string;
  cohort: CohortTier;
  discipline: PlayerDiscipline;
  preferredDate: string;
  linkedSessionId?: string;
  linkedLaneLabel?: string;
  notes?: string;
}

interface AcademyContextValue {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  athletes: AthleteProfile[];
  selectedAthleteId: string;
  setSelectedAthleteId: (id: string) => void;
  deliveries: DeliveryRecord[];
  addDelivery: (delivery: Omit<DeliveryRecord, 'id' | 'timestamp'>) => void;
  resetTelemetry: () => void;
  sessions: NetSession[];
  updateSessionStatus: (sessionId: string, status: SessionStatus) => void;
  bookings: BookingRecord[];
  createBooking: (input: NewBookingInput) => BookingRecord;
  bookingModal: BookingModalOptions;
  openBookingModal: (opts?: Omit<BookingModalOptions, 'isOpen'>) => void;
  closeBookingModal: () => void;
}

const STORAGE_KEY = 'apex_cricket_academy_v1';

interface PersistedPayload {
  deliveries: DeliveryRecord[];
  sessions: NetSession[];
  bookings: BookingRecord[];
}

function loadInitialState(): PersistedPayload {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        deliveries: SEED_DELIVERIES,
        sessions: SEED_SESSIONS,
        bookings: [],
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedPayload>;
    return {
      deliveries: Array.isArray(parsed.deliveries) && parsed.deliveries.length > 0 ? parsed.deliveries : SEED_DELIVERIES,
      sessions: Array.isArray(parsed.sessions) && parsed.sessions.length > 0 ? parsed.sessions : SEED_SESSIONS,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
    };
  } catch {
    return {
      deliveries: SEED_DELIVERIES,
      sessions: SEED_SESSIONS,
      bookings: [],
    };
  }
}

const AcademyContext = createContext<AcademyContextValue | null>(null);

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initial] = useState<PersistedPayload>(() => loadInitialState());
  const [activeView, setActiveView] = useState<AppView>('overview');
  const [athletes, setAthletes] = useState<AthleteProfile[]>(SEED_ATHLETES);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(SEED_ATHLETES[0].id);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(initial.deliveries);
  const [sessions, setSessions] = useState<NetSession[]>(initial.sessions);
  const [bookings, setBookings] = useState<BookingRecord[]>(initial.bookings);
  const [bookingModal, setBookingModal] = useState<BookingModalOptions>({ isOpen: false });

  useEffect(() => {
    try {
      const payload: PersistedPayload = { deliveries, sessions, bookings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [deliveries, sessions, bookings]);

  const addDelivery = (entry: Omit<DeliveryRecord, 'id' | 'timestamp'>) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    const newRecord: DeliveryRecord = {
      ...entry,
      id: `del-${Date.now()}`,
      timestamp: `${hh}:${mm}`,
    };

    setDeliveries((prev) => [newRecord, ...prev]);

    setAthletes((prev) =>
      prev.map((a) =>
        a.id === entry.athleteId
          ? {
              ...a,
              peakSpeedKmh:
                entry.mode === 'bowling' ? Math.max(a.peakSpeedKmh, entry.speedKmh) : a.peakSpeedKmh,
              averageExitVeloKmh:
                entry.mode === 'batting'
                  ? Number(((a.averageExitVeloKmh + entry.spinRpmOrExitVelo) / 2).toFixed(1))
                  : a.averageExitVeloKmh,
            }
          : a
      )
    );
  };

  const resetTelemetry = () => {
    setDeliveries(SEED_DELIVERIES);
    setAthletes(SEED_ATHLETES);
  };

  const updateSessionStatus = (sessionId: string, status: SessionStatus) => {
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, status } : s)));
  };

  const createBooking = (input: NewBookingInput): BookingRecord => {
    const record: BookingRecord = {
      ...input,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [record, ...prev]);

    if (input.linkedSessionId) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === input.linkedSessionId && s.enrolledCount < s.capacity
            ? { ...s, enrolledCount: s.enrolledCount + 1 }
            : s
        )
      );
    }

    return record;
  };

  const openBookingModal = (opts?: Omit<BookingModalOptions, 'isOpen'>) => {
    setBookingModal({ isOpen: true, ...opts });
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false });
  };

  const handleSetView = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AcademyContext.Provider
      value={{
        activeView,
        setActiveView: handleSetView,
        athletes,
        selectedAthleteId,
        setSelectedAthleteId,
        deliveries,
        addDelivery,
        resetTelemetry,
        sessions,
        updateSessionStatus,
        bookings,
        createBooking,
        bookingModal,
        openBookingModal,
        closeBookingModal,
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export function useAcademy(): AcademyContextValue {
  const ctx = useContext(AcademyContext);
  if (!ctx) {
    throw new Error('useAcademy must be used inside AcademyProvider');
  }
  return ctx;
}
