
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { WorkoutEntry, WorkoutPreset, StrengthExercise, MobilityExercise, RunningSession } from '@/types/workout';
import { mockWorkouts, mockWorkoutPresets, mockStrengthExercises, mockMobilityExercises, mockRunningSessions } from '@/lib/workout-data';
import { fetchWorkouts, createWorkout, updateWorkout, deleteWorkout, fetchWorkoutPresets } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';

interface WorkoutContextType {
  workouts: WorkoutEntry[];
  workoutPresets: WorkoutPreset[];
  selectedDate: Date;
  strengthExercises: StrengthExercise[];
  mobilityExercises: MobilityExercise[];
  runningSessions: RunningSession[];
  setSelectedDate: (date: Date) => void;
  addWorkout: (workout: Omit<WorkoutEntry, 'id'>) => void;
  updateWorkout: (id: string, updates: Partial<WorkoutEntry>) => void;
  deleteWorkout: (id: string) => void;
  updateStrengthExercise: (index: number, updates: Partial<StrengthExercise>) => void;
  updateMobilityExercise: (index: number, updates: Partial<MobilityExercise>) => void;
  updateRunningSession: (index: number, updates: Partial<RunningSession>) => void;
  applyPresetToDate: (presetId: string, date: Date) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [workoutPresets, setWorkoutPresets] = useState<WorkoutPreset[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [strengthExercises, setStrengthExercises] = useState<StrengthExercise[]>(mockStrengthExercises);
  const [mobilityExercises, setMobilityExercises] = useState<MobilityExercise[]>(mockMobilityExercises);
  const [runningSessions, setRunningSessions] = useState<RunningSession[]>(mockRunningSessions);
  const [loading, setLoading] = useState(true);

  // Load workouts and presets from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [workoutsData, presetsData] = await Promise.all([
          fetchWorkouts(),
          fetchWorkoutPresets()
        ]);
        
        setWorkouts(workoutsData);
        setWorkoutPresets(presetsData);
      } catch (error) {
        console.error("Error loading workout data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load your workout data. Using sample data instead.",
          variant: "destructive"
        });
        
        // Fallback to mock data if API fails
        setWorkouts(mockWorkouts);
        setWorkoutPresets(mockWorkoutPresets);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addWorkout = async (workout: Omit<WorkoutEntry, 'id'>) => {
    try {
      const newWorkout = await createWorkout(workout);
      if (newWorkout) {
        setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
        toast({
          title: "Workout added",
          description: `${workout.title} added to ${format(workout.date, 'MMM d, yyyy')}`,
        });
      }
    } catch (error) {
      console.error("Error adding workout:", error);
      // Fallback to local state if API fails
      const newWorkout: WorkoutEntry = {
        id: uuidv4(),
        ...workout
      };
      setWorkouts(prev => [...prev, newWorkout]);
    }
  };

  const handleUpdateWorkout = async (id: string, updates: Partial<WorkoutEntry>) => {
    try {
      const updatedWorkout = await updateWorkout(id, updates);
      if (updatedWorkout) {
        setWorkouts(prevWorkouts => 
          prevWorkouts.map(workout => workout.id === id ? {...workout, ...updates} : workout)
        );
        if (updates.completed !== undefined) {
          toast({
            title: updates.completed ? "Workout completed" : "Workout marked incomplete",
            description: `Your workout has been updated`,
          });
        } else {
          toast({
            title: "Workout updated",
            description: `Your workout details have been updated`,
          });
        }
      }
    } catch (error) {
      console.error("Error updating workout:", error);
      // Fallback to local state if API fails
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => workout.id === id ? {...workout, ...updates} : workout)
      );
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      const success = await deleteWorkout(id);
      if (success) {
        setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id !== id));
        toast({
          title: "Workout deleted",
          description: "Your workout has been removed",
        });
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      // Fallback to local state if API fails
      setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id !== id));
    }
  };

  // For exercise logs (still using mock data until we implement workout logs table functionality)
  const updateStrengthExercise = (index: number, updates: Partial<StrengthExercise>) => {
    setStrengthExercises(prev => 
      prev.map((exercise, i) => i === index ? {...exercise, ...updates} : exercise)
    );
  };

  const updateMobilityExercise = (index: number, updates: Partial<MobilityExercise>) => {
    setMobilityExercises(prev => 
      prev.map((exercise, i) => i === index ? {...exercise, ...updates} : exercise)
    );
  };

  const updateRunningSession = (index: number, updates: Partial<RunningSession>) => {
    setRunningSessions(prev => 
      prev.map((session, i) => i === index ? {...session, ...updates} : session)
    );
  };

  const applyPresetToDate = (presetId: string, date: Date) => {
    const preset = workoutPresets.find(p => p.id === presetId);
    if (!preset) return;
    
    const day = format(date, 'EEEE');
    
    const newWorkout: Omit<WorkoutEntry, 'id'> = {
      date,
      day,
      title: preset.name,
      type: preset.type,
      completed: false,
      note: preset.description,
    };
    
    addWorkout(newWorkout);
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      workoutPresets,
      selectedDate,
      strengthExercises,
      mobilityExercises,
      runningSessions,
      setSelectedDate,
      addWorkout,
      updateWorkout: handleUpdateWorkout,
      deleteWorkout: handleDeleteWorkout,
      updateStrengthExercise,
      updateMobilityExercise,
      updateRunningSession,
      applyPresetToDate,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
