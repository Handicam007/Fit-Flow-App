
import { WorkoutProvider } from '@/context/WorkoutContext';
import Header from '@/components/Header';
import RunningLog from '@/components/RunningLog';

const RunningPage = () => {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header activeTab="running" />
        <main className="flex-1 container py-6">
          <div className="grid gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Running Tracker</h2>
              <p className="text-muted-foreground mb-6">Track your running sessions and performance</p>
              <RunningLog />
            </div>
          </div>
        </main>
      </div>
    </WorkoutProvider>
  );
};

export default RunningPage;
