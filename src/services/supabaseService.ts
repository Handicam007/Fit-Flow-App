
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutEntry, WorkoutPreset } from "@/types/workout";

// Workouts
export const fetchWorkouts = async () => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*');
    
    if (error) throw error;
    
    // Convert date strings to Date objects
    return data.map(workout => ({
      ...workout,
      date: new Date(workout.date),
    })) as WorkoutEntry[];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    toast({
      title: "Error fetching workouts",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const createWorkout = async (workout: Omit<WorkoutEntry, 'id'>) => {
  try {
    // Convert Date object to ISO string for the database
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        date: workout.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        title: workout.title,
        type: workout.type,
        completed: workout.completed,
        note: workout.note,
        day: workout.day,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert date string back to Date object
    return {
      ...data,
      date: new Date(data.date),
    } as WorkoutEntry;
  } catch (error) {
    console.error('Error creating workout:', error);
    toast({
      title: "Error creating workout",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const updateWorkout = async (id: string, updates: Partial<WorkoutEntry>) => {
  try {
    // Prepare date if it exists in updates
    const preparedUpdates: Record<string, any> = { ...updates };
    if (updates.date) {
      preparedUpdates.date = updates.date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    }
    
    const { data, error } = await supabase
      .from('workouts')
      .update(preparedUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert date string back to Date object
    return {
      ...data,
      date: new Date(data.date),
    } as WorkoutEntry;
  } catch (error) {
    console.error('Error updating workout:', error);
    toast({
      title: "Error updating workout",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const deleteWorkout = async (id: string) => {
  try {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    toast({
      title: "Error deleting workout",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Workout Presets
export const fetchWorkoutPresets = async () => {
  try {
    const { data, error } = await supabase
      .from('workout_presets')
      .select('*');
    
    if (error) throw error;
    
    return data as WorkoutPreset[];
  } catch (error) {
    console.error('Error fetching workout presets:', error);
    toast({
      title: "Error fetching workout presets",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Define a simple flat type for exercise data
interface ExerciseData {
  id?: string;
  exercise?: string;
  date?: string;
  type?: string;
  sets?: string;
  reps?: string;
  weight?: string;
  duration?: string;
  distance?: string;
  pace?: string;
  notes?: string;
  day?: string;
}

// Workout Logs for specific types
export const fetchStrengthExercises = async (): Promise<ExerciseData[]> => {
  try {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('type', 'Strength');
    
    if (error) throw error;
    
    return (data || []) as ExerciseData[];
  } catch (error) {
    console.error('Error fetching strength exercises:', error);
    toast({
      title: "Error fetching strength exercises",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const fetchMobilityExercises = async (): Promise<ExerciseData[]> => {
  try {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('type', 'Mobility');
    
    if (error) throw error;
    
    return (data || []) as ExerciseData[];
  } catch (error) {
    console.error('Error fetching mobility exercises:', error);
    toast({
      title: "Error fetching mobility exercises",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const fetchRunningSessions = async (): Promise<ExerciseData[]> => {
  try {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('type', 'Running');
    
    if (error) throw error;
    
    return (data || []) as ExerciseData[];
  } catch (error) {
    console.error('Error fetching running sessions:', error);
    toast({
      title: "Error fetching running sessions",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};
