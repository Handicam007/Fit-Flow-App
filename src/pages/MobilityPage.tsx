
import { WorkoutProvider } from '@/context/WorkoutContext';
import Header from '@/components/Header';
import MobilityLog from '@/components/MobilityLog';

const MobilityPage = () => {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header activeTab="mobility" />
        <main className="flex-1 container py-6">
          <div className="grid gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Mobility & Flexibility</h2>
              <p className="text-muted-foreground mb-6">Track your mobility and flexibility exercises</p>
              <MobilityLog />
            </div>
          </div>
        </main>
      </div>
    </WorkoutProvider>
  );
};

export default MobilityPage;
