
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkoutEntry, StrengthExercise, MobilityExercise, RunningSession, WorkoutPreset } from '@/types/workout';
import { 
  generateInitialWorkouts, 
  defaultStrengthExercises, 
  defaultMobilityExercises,
  defaultRunningSessions,
  defaultWorkoutPresets
} from '@/lib/workout-data';
import { format } from 'date-fns';

interface WorkoutContextType {
  workouts: WorkoutEntry[];
  selectedDate: Date;
  strengthExercises: StrengthExercise[];
  mobilityExercises: MobilityExercise[];
  runningSessions: RunningSession[];
  workoutPresets: WorkoutPreset[];
  
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
  
  addWorkoutPreset: (preset: WorkoutPreset) => void;
  updateWorkoutPreset: (id: string, preset: Partial<WorkoutPreset>) => void;
  deleteWorkoutPreset: (id: string) => void;
  applyPresetToDate: (presetId: string, date: Date) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [strengthExercises, setStrengthExercises] = useState<StrengthExercise[]>([]);
  const [mobilityExercises, setMobilityExercises] = useState<MobilityExercise[]>([]);
  const [runningSessions, setRunningSessions] = useState<RunningSession[]>([]);
  const [workoutPresets, setWorkoutPresets] = useState<WorkoutPreset[]>([]);

  // Initialize with default data
  useEffect(() => {
    setWorkouts(generateInitialWorkouts());
    setStrengthExercises(defaultStrengthExercises);
    setMobilityExercises(defaultMobilityExercises);
    setRunningSessions(defaultRunningSessions);
    setWorkoutPresets(defaultWorkoutPresets);
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

  // New functions for workout presets
  const addWorkoutPreset = (preset: WorkoutPreset) => {
    setWorkoutPresets([...workoutPresets, preset]);
  };

  const updateWorkoutPreset = (id: string, updatedPreset: Partial<WorkoutPreset>) => {
    setWorkoutPresets(workoutPresets.map(preset => 
      preset.id === id ? { ...preset, ...updatedPreset } : preset
    ));
  };

  const deleteWorkoutPreset = (id: string) => {
    setWorkoutPresets(workoutPresets.filter(preset => preset.id !== id));
  };

  // Apply a preset to a specific date in the calendar
  const applyPresetToDate = (presetId: string, date: Date) => {
    const preset = workoutPresets.find(p => p.id === presetId);
    if (!preset) return;

    const formattedDate = format(date, 'yyyy-MM-dd');
    const existingWorkout = workouts.find(w => format(w.date, 'yyyy-MM-dd') === formattedDate);

    if (existingWorkout) {
      // Update existing workout
      updateWorkout(existingWorkout.id, {
        title: preset.name,
        type: preset.type,
      });
    } else {
      // Create new workout
      addWorkout({
        id: `workout-${formattedDate}`,
        date,
        day: format(date, 'EEEE'),
        title: preset.name,
        type: preset.type,
        completed: false,
      });
    }
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      selectedDate,
      strengthExercises,
      mobilityExercises,
      runningSessions,
      workoutPresets,
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
      addWorkoutPreset,
      updateWorkoutPreset,
      deleteWorkoutPreset,
      applyPresetToDate,
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
