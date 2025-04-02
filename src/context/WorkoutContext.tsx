
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkoutEntry, StrengthExercise, MobilityExercise, RunningSession } from '@/types/workout';
import { 
  generateInitialWorkouts, 
  defaultStrengthExercises, 
  defaultMobilityExercises,
  defaultRunningSessions 
} from '@/lib/workout-data';
import { format } from 'date-fns';

interface WorkoutContextType {
  workouts: WorkoutEntry[];
  selectedDate: Date;
  strengthExercises: StrengthExercise[];
  mobilityExercises: MobilityExercise[];
  runningSessions: RunningSession[];
  
  setSelectedDate: (date: Date) => void;
  addWorkout: (workout: WorkoutEntry) => void;
  updateWorkout: (id: string, workout: Partial<WorkoutEntry>) => void;
  deleteWorkout: (id: string) => void;
  
  addStrengthExercise: (exercise: StrengthExercise) => void;
  updateStrengthExercise: (index: number, exercise: Partial<StrengthExercise>) => void;
  
  addMobilityExercise: (exercise: MobilityExercise) => void;
  updateMobilityExercise: (index: number, exercise: Partial<MobilityExercise>) => void;
  
  addRunningSession: (session: RunningSession) => void;
  updateRunningSession: (index: number, session: Partial<RunningSession>) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [strengthExercises, setStrengthExercises] = useState<StrengthExercise[]>([]);
  const [mobilityExercises, setMobilityExercises] = useState<MobilityExercise[]>([]);
  const [runningSessions, setRunningSessions] = useState<RunningSession[]>([]);

  // Initialize with default data
  useEffect(() => {
    setWorkouts(generateInitialWorkouts());
    setStrengthExercises(defaultStrengthExercises);
    setMobilityExercises(defaultMobilityExercises);
    setRunningSessions(defaultRunningSessions);
  }, []);

  const addWorkout = (workout: WorkoutEntry) => {
    setWorkouts([...workouts, workout]);
  };

  const updateWorkout = (id: string, updatedWorkout: Partial<WorkoutEntry>) => {
    setWorkouts(workouts.map(workout => 
      workout.id === id ? { ...workout, ...updatedWorkout } : workout
    ));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  const addStrengthExercise = (exercise: StrengthExercise) => {
    setStrengthExercises([...strengthExercises, exercise]);
  };

  const updateStrengthExercise = (index: number, updatedExercise: Partial<StrengthExercise>) => {
    const newExercises = [...strengthExercises];
    newExercises[index] = { ...newExercises[index], ...updatedExercise };
    setStrengthExercises(newExercises);
  };

  const addMobilityExercise = (exercise: MobilityExercise) => {
    setMobilityExercises([...mobilityExercises, exercise]);
  };

  const updateMobilityExercise = (index: number, updatedExercise: Partial<MobilityExercise>) => {
    const newExercises = [...mobilityExercises];
    newExercises[index] = { ...newExercises[index], ...updatedExercise };
    setMobilityExercises(newExercises);
  };

  const addRunningSession = (session: RunningSession) => {
    setRunningSessions([...runningSessions, session]);
  };

  const updateRunningSession = (index: number, updatedSession: Partial<RunningSession>) => {
    const newSessions = [...runningSessions];
    newSessions[index] = { ...newSessions[index], ...updatedSession };
    setRunningSessions(newSessions);
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      selectedDate,
      strengthExercises,
      mobilityExercises,
      runningSessions,
      setSelectedDate,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      addStrengthExercise,
      updateStrengthExercise,
      addMobilityExercise,
      updateMobilityExercise,
      addRunningSession,
      updateRunningSession,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
