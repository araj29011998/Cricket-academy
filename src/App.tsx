import React from 'react';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { OverviewView } from './components/OverviewView';
import { ProgramsView } from './components/ProgramsView';
import { ScheduleView } from './components/ScheduleView';
import { TelemetryView } from './components/TelemetryView';
import { AcademyProvider, useAcademy } from './context/AcademyContext';

const AcademyShell: React.FC = () => {
  const { activeView } = useAcademy();

  return (
    <div className="min-h-screen flex flex-col bg-[#061f13] text-slate-100">
      <Navbar />
      <main className="flex-1">
        {activeView === 'overview' && <OverviewView />}
        {activeView === 'telemetry' && <TelemetryView />}
        {activeView === 'schedule' && <ScheduleView />}
        {activeView === 'programs' && <ProgramsView />}
      </main>
      <Footer />
      <BookingModal />
    </div>
  );
};

export default function App() {
  return (
    <AcademyProvider>
      <AcademyShell />
    </AcademyProvider>
  );
}
