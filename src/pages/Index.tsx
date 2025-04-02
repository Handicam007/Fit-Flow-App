
import { WorkoutProvider } from '@/context/WorkoutContext';
import Header from '@/components/Header';
import WorkoutCalendar from '@/components/WorkoutCalendar';
import WorkoutDetail from '@/components/WorkoutDetail';

const Index = () => {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header activeTab="calendar" />
        <main className="flex-1 container py-6">
          <div className="grid gap-6 md:grid-cols-[380px_1fr]">
            <div>
              <h2 className="text-2xl font-bold mb-4">Workout Calendar</h2>
              <WorkoutCalendar />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Selected Workout</h2>
              <WorkoutDetail />
            </div>
          </div>
        </main>
      </div>
    </WorkoutProvider>
  );
};

export default Index;
