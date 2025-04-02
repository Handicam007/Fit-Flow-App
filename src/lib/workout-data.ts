
import { format, addDays, startOfWeek } from "date-fns";
import { WorkoutEntry, StrengthExercise, MobilityExercise, RunningSession, WorkoutType, WorkoutPreset } from "@/types/workout";

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

// Default workout presets
export const defaultWorkoutPresets: WorkoutPreset[] = [
  // Strength presets
  {
    id: "preset-strength-push",
    name: "Full Body (Push Focus)",
    type: "Strength" as WorkoutType,
    description: "Full body workout with emphasis on pushing movements",
    exercises: [
      { exercise: "Squat (Front/Back)", sets: "4", reps: "6-8", notes: "Focus on form" },
      { exercise: "Dumbbell Bench Press", sets: "3", reps: "8-10", notes: "Full range of motion" },
      { exercise: "Bulgarian Split Squat", sets: "3", reps: "10 each leg", notes: "Keep core engaged" },
      { exercise: "Overhead DB Press", sets: "3", reps: "10", notes: "Controlled movement" },
      { exercise: "Hanging Leg Raises", sets: "3", reps: "10", notes: "Engage core" },
    ]
  },
  {
    id: "preset-strength-pull",
    name: "Full Body (Pull Focus)",
    type: "Strength" as WorkoutType,
    description: "Full body workout with emphasis on pulling movements",
    exercises: [
      { exercise: "Trap Bar Deadlift", sets: "4", reps: "6", notes: "Maintain neutral spine" },
      { exercise: "Pull-Ups / Lat Pulldown", sets: "4", reps: "8-10", notes: "Full range, controlled" },
      { exercise: "Barbell Row", sets: "3", reps: "10", notes: "Keep back flat" },
      { exercise: "Hip Thrust / KB Swing", sets: "3", reps: "12", notes: "Focus on glutes" },
      { exercise: "Dead Bugs", sets: "3", reps: "10", notes: "Core stabilization" },
    ]
  },
  {
    id: "preset-strength-core",
    name: "Core & Mobility Circuit",
    type: "Strength" as WorkoutType,
    description: "Core strengthening with mobility work",
    exercises: [
      { exercise: "Plank", sets: "3", reps: "45 seconds", notes: "Keep body straight" },
      { exercise: "Side Plank", sets: "3", reps: "30 seconds each side", notes: "Stack shoulders" },
      { exercise: "Bird Dog", sets: "3", reps: "10 each side", notes: "Maintain stability" },
      { exercise: "Dead Bug", sets: "3", reps: "10 each side", notes: "Press lower back to floor" },
      { exercise: "Glute Bridge", sets: "3", reps: "15", notes: "Squeeze at top" },
    ]
  },
  
  // Mobility presets
  {
    id: "preset-mobility-full",
    name: "Full Body Mobility",
    type: "Mobility" as WorkoutType,
    description: "Comprehensive mobility routine for all major joints",
    exercises: [
      { exercise: "World's Greatest Stretch", reps: "2 reps each side", notes: "Dynamic hip opener" },
      { exercise: "Hip 90/90 Rotations", reps: "10 reps", notes: "Rotate hips fully" },
      { exercise: "Couch Stretch", duration: "0.5 per side", reps: "2 sets", notes: "Hold for 30 sec each side" },
      { exercise: "Cat-Cow & Downward Dog", duration: "1", reps: "Continuous", notes: "Flow smoothly" },
      { exercise: "Thoracic Spine Rotations", reps: "10 each side", notes: "Rotate from upper back" },
    ]
  },
  {
    id: "preset-mobility-lower",
    name: "Lower Body Mobility",
    type: "Mobility" as WorkoutType,
    description: "Focus on hip, knee, and ankle mobility",
    exercises: [
      { exercise: "Hip CAR's", reps: "5 each direction", notes: "Controlled movement" },
      { exercise: "Hip 90/90 Stretch", reps: "30 sec each side", notes: "Sit tall" },
      { exercise: "Couch Stretch", reps: "45 sec each side", notes: "Quad and hip flexor" },
      { exercise: "Ankle Mobility", reps: "10 each side", notes: "Push knee past toes" },
      { exercise: "Pigeon Pose", reps: "60 sec each side", notes: "Breathe into stretch" },
    ]
  },
  
  // Running presets
  {
    id: "preset-running-zone2",
    name: "Zone 2 Run",
    type: "Running" as WorkoutType,
    description: "Aerobic base building run at conversational pace",
    exercises: [
      { type: "Zone 2 Run", duration: "30-40", notes: "Keep HR 60-70% of max; conversational pace" }
    ]
  },
  {
    id: "preset-running-long",
    name: "Long Run",
    type: "Running" as WorkoutType,
    description: "Weekly long run at easy pace",
    exercises: [
      { type: "Long Run", distance: "5 (start)", notes: "Increase distance by 1 km weekly" }
    ]
  },
  {
    id: "preset-running-intervals",
    name: "Interval Training",
    type: "Running" as WorkoutType,
    description: "Speed work with intervals",
    exercises: [
      { type: "Interval Training", duration: "30", notes: "5 min warm-up, 5x(3 min hard/2 min easy), 5 min cool-down" }
    ]
  }
];
