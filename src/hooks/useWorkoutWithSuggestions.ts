import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { WorkoutType } from '../types/supabase';
import { useToast } from '../components/ui/use-toast';

interface Workout {
  id: string;
  user_id: string;
  date: string;
  title: string;
  type: WorkoutType;
  completed: boolean;
  note: string;
  exercises: any[];
}

interface WorkoutInput {
  date: string;
  title: string;
  type: WorkoutType;
  completed: boolean;
  note: string;
  exercises: any[];
}

interface WorkoutUpdate {
  title?: string;
  type?: WorkoutType;
  completed?: boolean;
  note?: string;
  exercises?: any[];
}

export function useWorkoutWithSuggestions(userId: string) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Sample suggestions based on day of week
  const suggestions = {
    Monday: "5x5 Squat, Bench Press, Barbell Row",
    Tuesday: "30 min Zone 2 Cardio, Mobility Work",
    Wednesday: "Rest and Recovery",
    Thursday: "5x5 Squat, Overhead Press, Deadlift",
    Friday: "30 min HIIT Session, Core Work",
    Saturday: "Long Outdoor Run or Hike",
    Sunday: "Full Body Mobility and Stretching"
  };

  // Sample workouts in case database is not available
  const sampleWorkouts = [
    {
      id: '1',
      user_id: userId,
      date: '2023-07-01',
      title: 'Monday Strength',
      type: 'strength' as WorkoutType,
      completed: true,
      note: '5x5 Squat, Bench Press, Barbell Row',
      exercises: []
    },
    {
      id: '2',
      user_id: userId,
      date: '2023-07-02',
      title: 'Tuesday Cardio',
      type: 'cardio' as WorkoutType,
      completed: false,
      note: '30 min Zone 2 Cardio, Mobility Work',
      exercises: []
    }
  ];

  // Fetch workouts from Supabase
  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching workouts:', error);
        setError('Failed to fetch workouts');
        setWorkouts(sampleWorkouts); // Fall back to sample workouts
        toast({
          title: 'Offline Mode',
          description: 'Using sample data - database connection unavailable',
          variant: 'destructive',
        });
      } else {
        setWorkouts(data || []);
      }
    } catch (err) {
      console.error('Exception fetching workouts:', err);
      setError('An unexpected error occurred');
      setWorkouts(sampleWorkouts); // Fall back to sample workouts
      toast({
        title: 'Offline Mode',
        description: 'Using sample data - database connection unavailable',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new workout
  const addWorkout = async (workout: WorkoutInput): Promise<Workout | null> => {
    try {
      const newWorkout = {
        ...workout,
        user_id: userId,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('workouts')
        .insert([newWorkout])
        .select()
        .single();

      if (error) {
        console.error('Error adding workout:', error);
        
        // Create a mock workout with a unique ID for offline mode
        const mockWorkout = {
          ...newWorkout,
          id: Date.now().toString(),
        } as Workout;
        
        setWorkouts([...workouts, mockWorkout]);
        return mockWorkout;
      }

      if (data) {
        setWorkouts([...workouts, data]);
        return data;
      }
      
      return null;
    } catch (err) {
      console.error('Exception adding workout:', err);
      
      // Create a mock workout with a unique ID for offline mode
      const mockWorkout = {
        ...workout,
        user_id: userId,
        id: Date.now().toString(),
      } as Workout;
      
      setWorkouts([...workouts, mockWorkout]);
      return mockWorkout;
    }
  };

  // Update an existing workout
  const updateWorkout = async (id: string, updates: WorkoutUpdate): Promise<Workout | null> => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating workout:', error);
        
        // Update the workout locally for offline mode
        const updatedWorkouts = workouts.map(w => 
          w.id === id ? { ...w, ...updates } : w
        );
        
        setWorkouts(updatedWorkouts);
        return updatedWorkouts.find(w => w.id === id) || null;
      }

      if (data) {
        setWorkouts(workouts.map(w => (w.id === id ? data : w)));
        return data;
      }
      
      return null;
    } catch (err) {
      console.error('Exception updating workout:', err);
      
      // Update the workout locally for offline mode
      const updatedWorkouts = workouts.map(w => 
        w.id === id ? { ...w, ...updates } : w
      );
      
      setWorkouts(updatedWorkouts);
      return updatedWorkouts.find(w => w.id === id) || null;
    }
  };

  // Delete a workout
  const deleteWorkout = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting workout:', error);
        
        // Delete the workout locally for offline mode
        setWorkouts(workouts.filter(w => w.id !== id));
        return true;
      }

      setWorkouts(workouts.filter(w => w.id !== id));
      return true;
    } catch (err) {
      console.error('Exception deleting workout:', err);
      
      // Delete the workout locally for offline mode
      setWorkouts(workouts.filter(w => w.id !== id));
      return true;
    }
  };

  // Get a workout suggestion based on day of week
  const getWorkoutSuggestion = (dayOfWeek: string): string => {
    return suggestions[dayOfWeek as keyof typeof suggestions] || "Rest Day";
  };

  // Load workouts on component mount
  useEffect(() => {
    fetchWorkouts();
  }, [userId]);

  return {
    workouts,
    loading,
    error,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutSuggestion,
    refreshWorkouts: fetchWorkouts
  };
} 