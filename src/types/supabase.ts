export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string | null
          default_sets: number | null
          default_reps: number | null
          default_weight: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id?: string | null
          default_sets?: number | null
          default_reps?: number | null
          default_weight?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string | null
          default_sets?: number | null
          default_reps?: number | null
          default_weight?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          type: WorkoutType
          category: string
          exercises: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: WorkoutType
          category: string
          exercises?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: WorkoutType
          category?: string
          exercises?: Json
          created_at?: string
          updated_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string | null
          date: string
          title: string
          type: WorkoutType
          completed: boolean
          note: string | null
          exercises: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          date: string
          title: string
          type: WorkoutType
          completed?: boolean
          note?: string | null
          exercises?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          date?: string
          title?: string
          type?: WorkoutType
          completed?: boolean
          note?: string | null
          exercises?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      workout_type: WorkoutType
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type WorkoutType = 'strength' | 'cardio' | 'mobility' | 'other'

export interface ExerciseDetails {
  sets?: number
  reps?: number
  weight?: number
  duration?: number
  distance?: number
  notes?: string
}

export interface WorkoutExercise {
  exercise_id: string
  details: Partial<ExerciseDetails>
}

export interface Exercise {
  id: string
  name: string
  description: string | null
  category_id: string | null
  default_sets: number | null
  default_reps: number | null
  default_weight: number | null
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface WorkoutTemplate {
  id: string
  name: string
  description: string | null
  type: WorkoutType
  category: string
  exercises: WorkoutExercise[]
  created_at: string
  updated_at: string
}

export interface Workout {
  id: string
  user_id: string | null
  date: string
  title: string
  type: WorkoutType
  completed: boolean
  note: string | null
  exercises: WorkoutExercise[]
  created_at: string
  updated_at: string
} 