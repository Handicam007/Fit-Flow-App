
import { format, addDays, startOfWeek } from "date-fns";
import { WorkoutEntry, StrengthExercise, MobilityExercise, RunningSession, WorkoutType } from "@/types/workout";

// Initial workout plan with 4 weeks of data
export const generateInitialWorkouts = (): WorkoutEntry[] => {
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  const workouts: WorkoutEntry[] = [];

  // Weekly workout plan
  const weeklyPlan = [
    { day: "Monday", title: "Bouldering + Mobility & Core", type: "Mobility" as WorkoutType },
    { day: "Tuesday", title: "Full Body Strength (Push Focus)", type: "Strength" as WorkoutType },
    { day: "Wednesday", title: "Zone 2 Run + Mobility & Core", type: "Running" as WorkoutType },
    { day: "Thursday", title: "Soccer", type: "Running" as WorkoutType },
    { day: "Friday", title: "Full Body Strength (Pull Focus)", type: "Strength" as WorkoutType },
    { day: "Saturday", title: "Bouldering OR Long Run", type: alternateWeeks },
    { day: "Sunday", title: "Active Recovery + Mobility", type: "Mobility" as WorkoutType },
  ];

  // Generate 4 weeks of workouts
  for (let week = 0; week < 4; week++) {
    weeklyPlan.forEach((workout, dayIndex) => {
      const date = addDays(startDate, week * 7 + dayIndex);
      
      workouts.push({
        id: `workout-${format(date, "yyyy-MM-dd")}`,
        date,
        day: workout.day,
        title: workout.title,
        type: typeof workout.type === "function" 
          ? workout.type(week) 
          : workout.type,
        completed: date < today,
      });
    });
  }

  return workouts;
};

// Helper to alternate between Mobility and Running for Saturdays
function alternateWeeks(week: number): WorkoutType {
  return week % 2 === 0 ? "Mobility" : "Running";
}

// Default strength training exercises
export const defaultStrengthExercises: StrengthExercise[] = [
  // Tuesday - Full Body (Push Focus)
  { exercise: "Squat (Front/Back)", sets: "4", reps: "6-8", notes: "Focus on form" },
  { exercise: "Dumbbell Bench Press", sets: "3", reps: "8-10", notes: "Full range of motion" },
  { exercise: "Bulgarian Split Squat", sets: "3", reps: "10 each leg", notes: "Keep core engaged" },
  { exercise: "Overhead DB Press", sets: "3", reps: "10", notes: "Controlled movement" },
  { exercise: "Hanging Leg Raises", sets: "3", reps: "10", notes: "Engage core" },
  { exercise: "Side Planks", sets: "3", reps: "30 sec per side", notes: "Keep hips elevated" },
  { exercise: "Pallof Press", sets: "3", reps: "10 each side", notes: "Slow, controlled" },
  
  // Friday - Full Body (Pull Focus)
  { exercise: "Trap Bar Deadlift", sets: "4", reps: "6", notes: "Maintain neutral spine" },
  { exercise: "Pull-Ups / Lat Pulldown", sets: "4", reps: "8-10", notes: "Full range, controlled" },
  { exercise: "Barbell Row", sets: "3", reps: "10", notes: "Keep back flat" },
  { exercise: "Hip Thrust / KB Swing", sets: "3", reps: "12", notes: "Focus on glutes" },
  { exercise: "Dead Bugs", sets: "3", reps: "10", notes: "Core stabilization" },
  { exercise: "Cossack Squats", sets: "3", reps: "8 each side", notes: "Improve mobility" },
  { exercise: "Couch Stretch", sets: "2", reps: "30 sec per side", notes: "Hip flexor release" }
];

// Default mobility exercises
export const defaultMobilityExercises: MobilityExercise[] = [
  { exercise: "World's Greatest Stretch", reps: "2 reps each side", notes: "Dynamic hip opener" },
  { exercise: "Hip 90/90 Rotations", reps: "10 reps", notes: "Rotate hips fully" },
  { exercise: "Couch Stretch", duration: "0.5 per side", reps: "2 sets", notes: "Hold for 30 sec each side" },
  { exercise: "Cat-Cow & Downward Dog", duration: "1", reps: "Continuous", notes: "Flow smoothly" },
  { exercise: "Dead Bug", reps: "3x10", notes: "Engage core" },
  { exercise: "Side Planks", reps: "3x30 sec each side", notes: "Stabilize core" },
  { exercise: "Glute Bridges", reps: "3x15", notes: "Squeeze glutes at top" }
];

// Default running sessions
export const defaultRunningSessions: RunningSession[] = [
  { type: "Zone 2 Run", duration: "30-40", notes: "Keep HR 60-70% of max; conversational pace" },
  { type: "Long Run", distance: "5 (start)", notes: "Increase distance by 1 km weekly" }
];
