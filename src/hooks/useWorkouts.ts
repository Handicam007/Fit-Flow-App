import { useState, useEffect } from 'react';
import { getWorkouts, addWorkout, updateWorkout, deleteWorkout } from '../lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useWorkouts = (userId: string) => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch workouts
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkouts(userId);
      setWorkouts(data);
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error',
        description: 'Failed to fetch workouts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new workout
  const handleAddWorkout = async (workout: any) => {
    try {
      const newWorkout = await addWorkout({ ...workout, user_id: userId });
      setWorkouts(prev => [...prev, newWorkout[0]]);
      toast({
        title: 'Success',
        description: 'Workout added successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to add workout',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Update workout
  const handleUpdateWorkout = async (id: string, updates: any) => {
    try {
      const updatedWorkout = await updateWorkout(id, updates);
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === id ? updatedWorkout[0] : workout
        )
      );
      toast({
        title: 'Success',
        description: 'Workout updated successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to update workout',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete workout
  const handleDeleteWorkout = async (id: string) => {
    try {
      await deleteWorkout(id);
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
      toast({
        title: 'Success',
        description: 'Workout deleted successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete workout',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [userId]);

  return {
    workouts,
    loading,
    error,
    addWorkout: handleAddWorkout,
    updateWorkout: handleUpdateWorkout,
    deleteWorkout: handleDeleteWorkout,
    refreshWorkouts: fetchWorkouts,
  };
}; 