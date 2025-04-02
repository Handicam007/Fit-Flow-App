import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Exercise, Category } from '../types/supabase';

const sampleCategories: Category[] = [
  { id: '1', name: 'Upper Body', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: 'Lower Body', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: 'Core', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', name: 'Cardio', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

const sampleExercises: Exercise[] = [
  { 
    id: 'bench-press', 
    name: 'Bench Press', 
    description: 'Barbell chest press lying on a bench', 
    category_id: '1',
    default_sets: 3,
    default_reps: 10,
    default_weight: 135,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: 'squat', 
    name: 'Squat', 
    description: 'Barbell squat', 
    category_id: '2',
    default_sets: 3,
    default_reps: 8,
    default_weight: 185,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: 'deadlift', 
    name: 'Deadlift', 
    description: 'Barbell deadlift', 
    category_id: '2',
    default_sets: 3,
    default_reps: 5,
    default_weight: 225,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: 'pullup', 
    name: 'Pull Up', 
    description: 'Bodyweight pull up', 
    category_id: '1',
    default_sets: 3,
    default_reps: 8,
    default_weight: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: 'plank', 
    name: 'Plank', 
    description: 'Core stability exercise', 
    category_id: '3',
    default_sets: 3,
    default_reps: 1,
    default_weight: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: 'running', 
    name: 'Running', 
    description: 'Outdoor or treadmill running', 
    category_id: '4',
    default_sets: null,
    default_reps: null,
    default_weight: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useExerciseLibrary = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch exercises and categories
  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*, categories(*)');
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      // Check if we got data or need to use samples
      if (exercisesError || categoriesError || !exercisesData?.length || !categoriesData?.length) {
        console.warn('Using sample exercise data');
        setExercises(sampleExercises);
        setCategories(sampleCategories);
      } else {
        setExercises(exercisesData);
        setCategories(categoriesData);
      }
    } catch (err: any) {
      console.error('Error fetching exercises:', err);
      setError(err);
      // Fall back to sample data
      setExercises(sampleExercises);
      setCategories(sampleCategories);
    } finally {
      setLoading(false);
    }
  };

  // Add new exercise
  const addExercise = async (exercise: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert(exercise)
        .select()
        .single();
      
      if (error) throw error;
      
      setExercises(prev => [...prev, data as Exercise]);
      return data as Exercise;
    } catch (err: any) {
      console.error('Error adding exercise:', err);
      
      // Create a mock exercise with a random ID if database operation fails
      const mockExercise: Exercise = {
        id: `mock-${Date.now()}`,
        ...exercise,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setExercises(prev => [...prev, mockExercise]);
      return mockExercise;
    }
  };

  // Update exercise
  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setExercises(prev => 
        prev.map(exercise => exercise.id === id ? data as Exercise : exercise)
      );
      return data as Exercise;
    } catch (err: any) {
      console.error('Error updating exercise:', err);
      
      // Update locally if database operation fails
      const updatedExercise = { 
        ...exercises.find(e => e.id === id),
        ...updates,
        updated_at: new Date().toISOString()
      } as Exercise;
      
      setExercises(prev => 
        prev.map(exercise => exercise.id === id ? updatedExercise : exercise)
      );
      
      return updatedExercise;
    }
  };

  // Delete exercise
  const deleteExercise = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setExercises(prev => prev.filter(exercise => exercise.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting exercise:', err);
      
      // Delete locally if database operation fails
      setExercises(prev => prev.filter(exercise => exercise.id !== id));
      return true;
    }
  };

  // Get exercises by category
  const getExercisesByCategory = (categoryId: string) => {
    return exercises.filter(exercise => exercise.category_id === categoryId);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return {
    exercises,
    categories,
    loading,
    error,
    addExercise,
    updateExercise,
    deleteExercise,
    getExercisesByCategory,
    refreshExercises: fetchExercises,
  };
}; 