
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { WorkoutEntry, WorkoutPreset, StrengthExercise, MobilityExercise, RunningSession } from '../types/workout';
import { mockWorkouts, mockWorkoutPresets, mockStrengthExercises, mockMobilityExercises, mockRunningSessions } from '../lib/workout-data';
import { 
  fetchWorkouts, 
  createWorkout, 
  updateWorkout as updateWorkoutService, 
  deleteWorkout as deleteWorkoutService, 
  fetchWorkoutPresets,
  fetchSuggestedWorkouts
} from '../services/supabaseService';
import { toast } from '../hooks/use-toast';

interface WorkoutContextType {
  workouts: WorkoutEntry[];
  suggestedWorkouts: (WorkoutEntry & { isSuggested: boolean })[];
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
  convertSuggestedToActual: (id: string, updates?: Partial<WorkoutEntry>) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [suggestedWorkouts, setSuggestedWorkouts] = useState<(WorkoutEntry & { isSuggested: boolean })[]>([]);
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
        const [workoutsData, presetsData, suggestedData] = await Promise.all([
          fetchWorkouts(),
          fetchWorkoutPresets(),
          fetchSuggestedWorkouts()
        ]);
        
        setWorkouts(workoutsData);
        setWorkoutPresets(presetsData);
        setSuggestedWorkouts(suggestedData);
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
        setSuggestedWorkouts([]);
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
      const updatedWorkout = await updateWorkoutService(id, updates);
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
      const success = await deleteWorkoutService(id);
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

  const convertSuggestedToActual = async (id: string, updates?: Partial<WorkoutEntry>) => {
    const suggestedWorkout = suggestedWorkouts.find(workout => workout.id === id);
    if (!suggestedWorkout) return;
    
    try {
      // Apply updates and remove suggestion flag when converting
      const { isSuggested, ...workoutData } = suggestedWorkout;
      const updatedData = { ...workoutData, ...updates, isSuggested: false };
      
      const newWorkout = await createWorkout(updatedData);
      
      if (newWorkout) {
        // Remove from suggestions and add to regular workouts
        setSuggestedWorkouts(prev => prev.filter(w => w.id !== id));
        setWorkouts(prev => [...prev, newWorkout]);
        
        toast({
          title: "Workout confirmed",
          description: `Suggested workout has been added to your schedule`,
        });
      }
    } catch (error) {
      console.error("Error converting suggested workout:", error);
      toast({
        title: "Error",
        description: "Failed to convert suggested workout",
        variant: "destructive"
      });
    }
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      suggestedWorkouts,
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
      convertSuggestedToActual,
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
