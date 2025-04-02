
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { useWorkout } from '@/context/WorkoutContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DayClickEventHandler, DayContent } from 'react-day-picker';

const WorkoutCalendar = () => {
  const { workouts, selectedDate, setSelectedDate } = useWorkout();

  // Function to get workout for a specific date
  const getWorkoutForDate = (date: Date) => {
    return workouts.find(workout => isSameDay(workout.date, date));
  };

  // Custom render function for calendar days
  const renderDay = (day: Date) => {
    const workout = getWorkoutForDate(day);
    
    return (
      <>
        <div>{format(day, 'd')}</div>
        {workout && (
          <div className="mt-1">
            <Badge 
              className={cn(
                "workout-type-badge text-[9px]",
                {
                  'workout-type-badge-strength': workout.type === 'Strength',
                  'workout-type-badge-mobility': workout.type === 'Mobility',
                  'workout-type-badge-running': workout.type === 'Running'
                }
              )}
            >
              {workout.type}
            </Badge>
          </div>
        )}
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
            
            return (
              <div
                {...otherProps}
                className={cn(
                  className,
                  "relative h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  getWorkoutForDate(date) && "font-semibold",
                  getWorkoutForDate(date)?.completed && "bg-muted/50"
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
