
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, Edit, Save } from 'lucide-react';

const WorkoutDetail = () => {
  const { 
    workouts, 
    suggestedWorkouts,
    selectedDate,
    workoutPresets, 
    updateWorkout,
    applyPresetToDate,
    convertSuggestedToActual
  } = useWorkout();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');
  
  // Find workout for the selected date, prioritizing actual workouts over suggested ones
  const actualWorkout = workouts.find(workout => isSameDay(workout.date, selectedDate));
  const suggestedWorkout = suggestedWorkouts.find(workout => isSameDay(workout.date, selectedDate));
  
  // Use actual workout if available, otherwise use suggested
  const selectedWorkout = actualWorkout || suggestedWorkout;
  const isSuggested = !actualWorkout && !!suggestedWorkout;
  
  // Toggle completion status
  const toggleCompleted = () => {
    if (selectedWorkout) {
      updateWorkout(selectedWorkout.id, { 
        completed: !selectedWorkout.completed 
      });
    }
  };
  
  const handleSaveEdit = () => {
    if (selectedWorkout) {
      if (isSuggested && convertSuggestedToActual) {
        convertSuggestedToActual(selectedWorkout.id, {
          title: editTitle,
          note: editNote
        });
      } else {
        updateWorkout(selectedWorkout.id, {
          title: editTitle,
          note: editNote
        });
      }
      setIsEditing(false);
    }
  };
  
  const handleStartEdit = () => {
    if (selectedWorkout) {
      setEditTitle(selectedWorkout.title);
      setEditNote(selectedWorkout.note || '');
      setIsEditing(true);
    }
  };
  
  const getWorkoutTypeClasses = (type: WorkoutType) => {
    return {
      'bg-strength-light text-strength': type === 'Strength',
      'bg-mobility-light text-mobility': type === 'Mobility',
      'bg-running-light text-running': type === 'Running'
    };
  };

  const handlePresetSelect = (presetId: string) => {
    applyPresetToDate(presetId, selectedDate);
    setDialogOpen(false);
  };
  
  // Filter presets by type if a workout is already selected
  const filteredPresets = selectedWorkout 
    ? workoutPresets.filter(preset => preset.type === selectedWorkout.type)
    : workoutPresets;
  
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Workout</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Workout Type</DialogTitle>
                <DialogDescription>
                  Choose a workout preset to add to {format(selectedDate, 'EEEE, MMMM d')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  {workoutPresets.map(preset => (
                    <Button 
                      key={preset.id}
                      variant="outline"
                      className={cn(
                        "justify-start font-normal",
                        {
                          'border-strength text-strength': preset.type === 'Strength',
                          'border-mobility text-mobility': preset.type === 'Mobility',
                          'border-running text-running': preset.type === 'Running',
                        }
                      )}
                      onClick={() => handlePresetSelect(preset.id)}
                    >
                      <Badge className={cn("mr-2", {
                        'bg-strength text-white': preset.type === 'Strength',
                        'bg-mobility text-white': preset.type === 'Mobility',
                        'bg-running text-white': preset.type === 'Running',
                      })}>
                        {preset.type}
                      </Badge>
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className={cn("w-full", isSuggested && "border-dashed")}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {isEditing ? (
              <Input 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                className="text-xl font-bold mb-1"
              />
            ) : (
              <CardTitle className="flex items-center">
                {selectedWorkout.title}
                {isSuggested && (
                  <Badge variant="outline" className="ml-2 text-xs">Suggested</Badge>
                )}
              </CardTitle>
            )}
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
        <div className="space-y-4">
          {!isEditing ? (
            <>
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
              
              {selectedWorkout.note && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-1">Notes:</h4>
                  <p className="text-sm text-muted-foreground">{selectedWorkout.note}</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="note">Notes</Label>
              <Textarea 
                id="note" 
                value={editNote} 
                onChange={(e) => setEditNote(e.target.value)}
                rows={3}
              />
            </div>
          )}
          
          {!isEditing && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Change Workout Preset
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {filteredPresets.map(preset => (
                    <DropdownMenuItem 
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.id)}
                    >
                      {preset.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <Button 
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={handleStartEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        
        {isEditing ? (
          <Button onClick={handleSaveEdit}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        ) : (
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
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkoutDetail;
