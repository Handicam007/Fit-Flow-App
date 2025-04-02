
import { z } from "zod";

// Types of workouts
export const workoutTypes = ["Strength", "Mobility", "Running"] as const;
export type WorkoutType = typeof workoutTypes[number];

// For the strength training log
export const strengthExerciseSchema = z.object({
  id: z.string().optional(),
  date: z.date().optional(),
  day: z.string().optional(),
  exercise: z.string(),
  sets: z.string(),
  reps: z.string(),
  weight: z.string().optional(),
  notes: z.string().optional(),
});

export type StrengthExercise = z.infer<typeof strengthExerciseSchema>;

// For the mobility log
export const mobilityExerciseSchema = z.object({
  id: z.string().optional(),
  date: z.date().optional(),
  day: z.string().optional(),
  exercise: z.string(),
  duration: z.string().optional(),
  reps: z.string(),
  notes: z.string().optional(),
});

export type MobilityExercise = z.infer<typeof mobilityExerciseSchema>;

// For the running log
export const runningSessionSchema = z.object({
  id: z.string().optional(),
  date: z.date().optional(),
  day: z.string().optional(),
  type: z.string(),
  distance: z.string().optional(),
  duration: z.string().optional(),
  pace: z.string().optional(),
  notes: z.string().optional(),
});

export type RunningSession = z.infer<typeof runningSessionSchema>;

// Workout entry for the calendar
export const workoutEntrySchema = z.object({
  id: z.string(),
  date: z.date(),
  day: z.string(),
  title: z.string(),
  type: z.enum(workoutTypes),
  completed: z.boolean().default(false),
  note: z.string().optional(),
});

export type WorkoutEntry = z.infer<typeof workoutEntrySchema>;

// Workout preset (template)
export const workoutPresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(workoutTypes),
  description: z.string().optional(),
  exercises: z.array(
    z.union([
      strengthExerciseSchema,
      mobilityExerciseSchema,
      runningSessionSchema
    ])
  ).optional(),
});

export type WorkoutPreset = z.infer<typeof workoutPresetSchema>;

