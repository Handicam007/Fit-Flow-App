
import { useState } from 'react';
import { Calendar } from '../components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { useWorkout } from '../context/WorkoutContext';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import { DayClickEventHandler, DayContent } from 'react-day-picker';

const WorkoutCalendar = () => {
  const { workouts, suggestedWorkouts, selectedDate, setSelectedDate } = useWorkout();

  // Function to get workout for a specific date
  const getWorkoutForDate = (date: Date) => {
    // Check for actual workouts first
    const workout = workouts.find(workout => isSameDay(workout.date, date));
    if (workout) return { ...workout, isSuggested: false };
    
    // If no actual workout, check for suggested workouts
    const suggestedWorkout = suggestedWorkouts.find(workout => isSameDay(workout.date, date));
    if (suggestedWorkout) return { ...suggestedWorkout, isSuggested: true };
    
    return null;
  };

  // Custom render function for calendar days
  const renderDay = (day: Date) => {
    const workout = getWorkoutForDate(day);
    
    if (!workout) return <div>{format(day, 'd')}</div>;
    
    return (
      <>
        <div>{format(day, 'd')}</div>
        <div className="mt-1">
          <Badge 
            className={cn(
              "workout-type-badge text-[9px]",
              {
                'workout-type-badge-strength': workout.type === 'Strength',
                'workout-type-badge-mobility': workout.type === 'Mobility',
                'workout-type-badge-running': workout.type === 'Running',
                'opacity-60 border-dashed': workout.isSuggested
              }
            )}
          >
            {workout.type}
          </Badge>
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md"
        components={{
          Day: ({ date, ...props }) => {
            // Make sure we're only using the props that exist on the div element
            const { className, ...otherProps } = props as { className?: string };
            const workout = getWorkoutForDate(date);
            
            return (
              <div
                {...otherProps}
                className={cn(
                  className,
                  "relative h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  workout && "font-semibold",
                  workout?.completed && "bg-muted/50",
                  workout?.isSuggested && "bg-muted/20 border-dashed"
                )}
              >
                <div className="flex h-full w-full flex-col items-center justify-center">
                  {renderDay(date)}
                </div>
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default WorkoutCalendar;
