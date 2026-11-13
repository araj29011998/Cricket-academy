import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { BookingRecord, CohortTier, PlayerDiscipline } from '../types/academy';

const COHORTS: CohortTier[] = ['U-13', 'U-15', 'U-17', 'U-19', 'Senior'];
const DISCIPLINES: PlayerDiscipline[] = [
  'Pace Bowler',
  'Spin Bowler',
  'Top-Order Batter',
  'All-Rounder',
];

export const BookingModal: React.FC = () => {
  const { bookingModal, closeBookingModal, createBooking, bookings } = useAcademy();

  const [athleteName, setAthleteName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cohort, setCohort] = useState<CohortTier>('U-17');
  const [discipline, setDiscipline] = useState<PlayerDiscipline>('Pace Bowler');
  const [preferredDate, setPreferredDate] = useState('2026-11-14');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmed, setConfirmed] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (bookingModal.isOpen) {
      setCohort(bookingModal.defaultCohort ?? 'U-17');
      setErrorMsg('');
      setConfirmed(null);
    }
  }, [bookingModal.isOpen, bookingModal.defaultCohort]);

  if (!bookingModal.isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = athleteName.trim();
    const trimmedEmail = email.trim();
    const digits = phone.replace(/\D/g, '');

    if (trimmedName.length < 2) {
      setErrorMsg('Enter the athlete full name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Enter a valid email address for session confirmation.');
      return;
    }
    if (digits.length < 7) {
      setErrorMsg('Enter a valid contact phone number (minimum 7 digits).');
      return;
    }

    const record = createBooking({
      athleteName: trimmedName,
      email: trimmedEmail,
      phone: phone.trim(),
      cohort,
      discipline,
      preferredDate,
      linkedSessionId: bookingModal.linkedSessionId,
      linkedLaneLabel: bookingModal.linkedLaneLabel,
      notes: notes.trim() || undefined,
    });

    setConfirmed(record);
    setAthleteName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setErrorMsg('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="w-full max-w-xl bg-[#081425] border border-slate-700/60 rounded shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0b3b24] border-b border-slate-700/50">
          <div>
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.08em] text-[#f59e0b]">
              {bookingModal.linkedLaneLabel ? 'Net Slot Reservation' : 'Assessment Intake'}
            </p>
            <h2
              id="booking-modal-title"
              className="font-display text-2xl font-semibold text-white uppercase tracking-wide"
            >
              {bookingModal.linkedLaneLabel
                ? `Reserve ${bookingModal.linkedLaneLabel}`
                : 'Book Academy Trial'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeBookingModal}
            className="w-9 h-9 inline-flex items-center justify-center rounded border border-slate-600/60 text-slate-300 hover:text-white hover:border-white transition-colors cursor-pointer"
            aria-label="Close booking dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[82vh] overflow-y-auto">
          {confirmed ? (
            <div className="space-y-5">
              <div className="p-5 bg-[#0b3b24] border border-[#f59e0b]/40 rounded space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#f59e0b] shrink-0" />
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white uppercase">
                      Slot Confirmed
                    </h3>
                    <p className="text-xs text-slate-300">
                      Reference {confirmed.id.toUpperCase()} · Saved to academy roster
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/50 text-sm">
                  <div>
                    <span className="block text-xs text-slate-400">Athlete</span>
                    <span className="font-medium text-white">{confirmed.athleteName}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Cohort &amp; Role</span>
                    <span className="font-medium text-white">
                      {confirmed.cohort} · {confirmed.discipline}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Preferred Date</span>
                    <span className="font-medium text-white tabular-nums">
                      {confirmed.preferredDate}
                    </span>
                  </div>
                  {confirmed.linkedLaneLabel && (
                    <div>
                      <span className="block text-xs text-slate-400">Assigned Lane</span>
                      <span className="font-medium text-[#f59e0b]">
                        {confirmed.linkedLaneLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmed(null)}
                  className="px-4 py-2.5 border border-slate-600 text-slate-200 hover:border-white hover:text-white font-label text-xs font-bold uppercase tracking-[0.06em] rounded transition-colors cursor-pointer"
                >
                  Book Another Athlete
                </button>
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-5 py-2.5 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {bookingModal.linkedLaneLabel && (
                <div className="px-4 py-3 bg-[#1e293b] border border-[#f59e0b]/40 rounded text-xs text-slate-200 flex items-center justify-between gap-4">
                  <span>
                    Target Session: <strong className="text-white">{bookingModal.linkedLaneLabel}</strong>
                  </span>
                  <span className="font-label font-bold text-[#f59e0b] uppercase">
                    Instrumented Lane
                  </span>
                </div>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  className="px-4 py-3 bg-[#93000a]/40 border border-[#d92d20] rounded text-sm text-white"
                >
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-name"
                    className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-300 mb-1.5"
                  >
                    Athlete Full Name
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                    placeholder="e.g. Kabir Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-slate-600/80 rounded text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#f59e0b]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-date"
                    className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-300 mb-1.5"
                  >
                    Preferred Date
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-slate-600/80 rounded text-sm text-white tabular-nums focus:outline-none focus:border-[#f59e0b]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-email"
                    className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-300 mb-1.5"
                  >
                    Parent / Athlete Email
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@club.org"
                    className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-slate-600/80 rounded text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#f59e0b]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-300 mb-1.5"
                  >
                    Contact Phone
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-8890"
                    className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-slate-600/80 rounded text-sm text-white placeholder-slate-400 tabular-nums focus:outline-none focus:border-[#f59e0b]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-cohort"
                    className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-300 mb-1.5"
                  >
                    Age Cohort
                  </label>
                  <select
                    id="booking-cohort"
                    value={cohort}
                    onChange={(e) => setCohort(e.target.value as CohortTier)}
                    className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-slate-600/80 rounded text-sm text-white focus:outline-none focus:border-[#f59e0b]"
                  >
                    {COHORTS.map((c) => (
                      <option key={c} value={c}>
                        {c} Squad
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="booking-discipline"
                    className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-300 mb-1.5"
                  >
                    Primary Discipline
                  </label>
                  <select
                    id="booking-discipline"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value as PlayerDiscipline)}
                    className="w-full px-3.5 py-2.5 bg-[#1e293b] border border-slate-600/80 rounded text-sm text-white focus:outline-none focus:border-[#f59e0b]"
                  >
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-notes"
                  className="block font-label text-[11px] font-bold uppercase tracking-[0.06em] text-slate-300 mb-1.5"
                >
                  Coaching Focus Notes (Optional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Back-foot drive consistency or new-ball outswing"
                  className="w-full px-3.5 py-2 bg-[#1e293b] border border-slate-600/80 rounded text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400 tabular-nums">
                  {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} logged this session
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="px-4 py-2.5 border border-slate-600 text-slate-300 hover:text-white hover:border-white font-label text-xs font-bold uppercase tracking-[0.06em] rounded transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#d92d20] hover:bg-[#b42318] text-white font-label text-xs font-bold uppercase tracking-[0.08em] rounded transition-colors cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
