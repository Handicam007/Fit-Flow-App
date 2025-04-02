
import { WorkoutProvider } from '../context/WorkoutContext';
import Header from '../components/Header';
import StrengthTrainingLog from '../components/StrengthTrainingLog';

const StrengthPage = () => {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header activeTab="strength" />
        <main className="flex-1 container py-6">
          <div className="grid gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Strength Training</h2>
              <p className="text-muted-foreground mb-6">Track your strength training progress and performance</p>
              <StrengthTrainingLog />
            </div>
          </div>
        </main>
      </div>
    </WorkoutProvider>
  );
};

export default StrengthPage;
