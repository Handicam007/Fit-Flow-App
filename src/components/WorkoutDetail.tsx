
import { useState } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { format, isSameDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { WorkoutType } from '@/types/workout';
import { cn } from '@/lib/utils';

const WorkoutDetail = () => {
  const { workouts, selectedDate, updateWorkout } = useWorkout();
  
  // Find the workout for the selected date
  const selectedWorkout = workouts.find(workout => isSameDay(workout.date, selectedDate));
  
  // Toggle completion status
  const toggleCompleted = () => {
    if (selectedWorkout) {
      updateWorkout(selectedWorkout.id, { 
        completed: !selectedWorkout.completed 
      });
    }
  };
  
  const getWorkoutTypeClasses = (type: WorkoutType) => {
    return {
      'bg-strength-light text-strength': type === 'Strength',
      'bg-mobility-light text-mobility': type === 'Mobility',
      'bg-running-light text-running': type === 'Running'
    };
  };
  
  if (!selectedWorkout) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Workout</CardTitle>
          <CardDescription>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>No workout planned for this day. Would you like to add one?</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Add Workout</Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{selectedWorkout.title}</CardTitle>
            <CardDescription>
              {format(selectedWorkout.date, 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </div>
          <Badge className={cn("workout-type-badge", getWorkoutTypeClasses(selectedWorkout.type))}>
            {selectedWorkout.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="completed" 
            checked={selectedWorkout.completed}
            onCheckedChange={toggleCompleted}
          />
          <Label htmlFor="completed">
            {selectedWorkout.completed ? "Completed" : "Mark as completed"}
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
        >
          View Details
        </Button>
        <Button 
          variant={selectedWorkout.type === 'Strength' ? 'default' : 'outline'}
          className={cn({
            'bg-strength border-strength hover:bg-strength/90': selectedWorkout.type === 'Strength',
            'bg-mobility border-mobility hover:bg-mobility/90 text-white': selectedWorkout.type === 'Mobility',
            'bg-running border-running hover:bg-running/90 text-white': selectedWorkout.type === 'Running',
          })}
        >
          Log {selectedWorkout.type} Workout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutDetail;
