import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Types for workouts
export type WorkoutType = 'strength' | 'cardio' | 'mobility' | 'other';

// Create a mock implementation if environment variables are missing
let mockData = {
  workouts: [],
  workout_templates: [
    {
      id: '1',
      name: 'Upper Body Strength',
      description: 'Focus on chest, shoulders, and back',
      type: 'strength' as WorkoutType,
      category: 'Strength',
      exercises: [
        { 
          exercise_id: 'bench-press', 
          details: { sets: 4, reps: 10, weight: 135 } 
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: '5K Run Training',
      description: 'Interval training for 5K preparation',
      type: 'cardio' as WorkoutType,
      category: 'Cardio',
      exercises: [
        { 
          exercise_id: 'running', 
          details: { duration: 30, distance: 5 } 
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Full Body Mobility',
      description: 'Improve flexibility and range of motion',
      type: 'mobility' as WorkoutType,
      category: 'Mobility',
      exercises: [
        { 
          exercise_id: 'hip-opener', 
          details: { duration: 10 } 
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Recovery Yoga',
      description: 'Gentle yoga flow for recovery days',
      type: 'other' as WorkoutType,
      category: 'Other',
      exercises: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  categories: [
    { id: '1', name: 'Upper Body', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', name: 'Lower Body', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '3', name: 'Core', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '4', name: 'Cardio', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  exercises: [
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
      id: 'running', 
      name: 'Running', 
      description: 'Outdoor or treadmill running', 
      category_id: '4',
      default_sets: null,
      default_reps: null,
      default_weight: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'hip-opener', 
      name: 'Hip Opener Stretch', 
      description: 'Stretching exercise for hip mobility', 
      category_id: '2',
      default_sets: 1,
      default_reps: 1,
      default_weight: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

// Create a mock implementation if Supabase isn't set up
const createMockClient = () => {
  console.warn('Using mock Supabase client. Configure environment variables for real data.');
  
  return {
    from: (table: string) => ({
      select: (query?: string) => {
        const mockPromise = Promise.resolve({
          data: mockData[table] || [],
          error: null
        });
        return {
          eq: () => mockPromise,
          order: () => mockPromise,
          limit: () => mockPromise,
          single: () => Promise.resolve({
            data: mockData[table]?.[0] || null,
            error: null
          })
        };
      },
      insert: (item: any) => {
        const newItem = { 
          id: Date.now().toString(), 
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockData[table] = [...(mockData[table] || []), newItem];
        return {
          select: () => Promise.resolve({ data: newItem, error: null }),
          single: () => Promise.resolve({ data: newItem, error: null })
        };
      },
      update: (updates: any) => ({
        eq: (field: string, value: any) => {
          const items = mockData[table] || [];
          const index = items.findIndex((item: any) => item[field] === value);
          if (index >= 0) {
            mockData[table][index] = { 
              ...mockData[table][index], 
              ...updates,
              updated_at: new Date().toISOString()
            };
          }
          return {
            select: () => Promise.resolve({ 
              data: index >= 0 ? mockData[table][index] : null, 
              error: null 
            }),
            single: () => Promise.resolve({ 
              data: index >= 0 ? mockData[table][index] : null, 
              error: null 
            })
          };
        }
      }),
      delete: () => ({
        eq: (field: string, value: any) => {
          const items = mockData[table] || [];
          mockData[table] = items.filter((item: any) => item[field] !== value);
          return Promise.resolve({ error: null });
        }
      })
    })
  };
};

// Create the Supabase client (real or mock)
export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockClient() as any 
  : createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  });

// Helper functions for data operations
export const getWorkouts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
};

export const addWorkout = async (workout: any) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding workout:', error);
    return null;
  }
};

export const updateWorkout = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating workout:', error);
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
    return false;
  }
};

// Sample data for offline mode or when database connection fails
export const sampleData = {
  workouts: [
    {
      id: '1',
      user_id: 'sample-user',
      date: '2023-07-01',
      title: 'Monday Strength',
      type: 'strength' as WorkoutType,
      completed: true,
      note: '5x5 Squat, Bench Press, Barbell Row',
      exercises: []
    },
    {
      id: '2',
      user_id: 'sample-user',
      date: new Date().toISOString().split('T')[0],
      title: 'Today\'s Cardio',
      type: 'cardio' as WorkoutType,
      completed: false,
      note: '30 min Zone 2 Cardio, Mobility Work',
      exercises: []
    }
  ],
  
  workoutTemplates: [
    {
      id: '1',
      name: 'Full Body Strength',
      description: 'Complete full body strength workout',
      type: 'strength' as WorkoutType,
      category: 'beginner',
      user_id: 'sample-user',
      exercises: [
        { id: '1', name: 'Squat', sets: 3, reps: 10 },
        { id: '2', name: 'Push-Up', sets: 3, reps: 12 },
        { id: '3', name: 'Plank', sets: 3, duration: 30 }
      ]
    },
    {
      id: '2',
      name: 'Quick HIIT',
      description: '20 minute HIIT session',
      type: 'cardio' as WorkoutType,
      category: 'intermediate',
      user_id: 'sample-user',
      exercises: [
        { id: '4', name: 'Burpees', sets: 4, reps: 15 },
        { id: '5', name: 'Mountain Climbers', sets: 4, reps: 20 },
        { id: '6', name: 'Jump Squats', sets: 4, reps: 15 }
      ]
    }
  ],
  
  categories: [
    { id: '1', name: 'Upper Body' },
    { id: '2', name: 'Lower Body' },
    { id: '3', name: 'Core' },
    { id: '4', name: 'Cardiovascular' },
    { id: '5', name: 'Flexibility' },
    { id: '6', name: 'Recovery' }
  ],
  
  exercises: [
    { id: '1', name: 'Push-Up', description: 'Standard push-up exercise', category_id: '1', default_sets: 3, default_reps: 10 },
    { id: '2', name: 'Squat', description: 'Bodyweight squat', category_id: '2', default_sets: 3, default_reps: 12 },
    { id: '3', name: 'Plank', description: 'Core stabilization exercise', category_id: '3', default_sets: 3, default_reps: 30 },
    { id: '4', name: 'Running', description: 'Outdoor or treadmill running', category_id: '4', default_sets: 1, default_reps: 20 },
    { id: '5', name: 'Downward Dog', description: 'Yoga pose for flexibility', category_id: '5', default_sets: 1, default_reps: 60 }
  ]
}; 