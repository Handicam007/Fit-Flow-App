import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { Button } from '../components/ui/button';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { ChevronLeft, ChevronRight, Plus, Check, Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { useWorkoutWithSuggestions } from '../hooks/useWorkoutWithSuggestions';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../components/ui/use-toast';
import { WorkoutType } from '../types/supabase';

export function Calendar() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, getWorkoutSuggestion } = useWorkoutWithSuggestions('test-user');
  const { toast } = useToast();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [createWorkoutOpen, setCreateWorkoutOpen] = useState(false);
  const [newWorkoutNote, setNewWorkoutNote] = useState('');

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const workout = workouts.find(w => w.date === formattedDate);
      setSelectedWorkout(workout || null);
      setIsEditing(false);
      
      // Get suggestion based on day of week
      if (!workout) {
        const suggestion = getWorkoutSuggestion(format(date, 'EEEE'));
        setNewWorkoutNote(suggestion);
      }
    }
  };

  const handleAddWorkout = async (type: WorkoutType) => {
    if (!selectedDate) return;
    
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const newWorkout = await addWorkout({
        date: formattedDate,
        title: `${format(selectedDate, 'EEEE')} Workout`,
        type,
        completed: false,
        note: newWorkoutNote,
        exercises: []
      });
      
      if (newWorkout) {
        setSelectedWorkout(newWorkout);
        setCreateWorkoutOpen(false);
        toast({
          title: 'Workout Added',
          description: 'Your workout has been added to the calendar',
        });
      }
    } catch (error) {
      console.error('Error adding workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to add workout',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateWorkout = async () => {
    if (!selectedWorkout) return;
    
    try {
      const updatedWorkout = await updateWorkout(selectedWorkout.id, {
        note: selectedWorkout.note,
        completed: selectedWorkout.completed
      });
      
      if (updatedWorkout) {
        setSelectedWorkout(updatedWorkout);
        setIsEditing(false);
        toast({
          title: 'Workout Updated',
          description: 'Your workout has been updated',
        });
      }
    } catch (error) {
      console.error('Error updating workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to update workout',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteWorkout = async () => {
    if (!selectedWorkout) return;
    
    try {
      const success = await deleteWorkout(selectedWorkout.id);
      
      if (success) {
        setSelectedWorkout(null);
        toast({
          title: 'Workout Deleted',
          description: 'Your workout has been removed from the calendar',
        });
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workout',
        variant: 'destructive',
      });
    }
  };

  const handleToggleComplete = async () => {
    if (!selectedWorkout) return;
    
    try {
      const updatedWorkout = await updateWorkout(selectedWorkout.id, {
        completed: !selectedWorkout.completed
      });
      
      if (updatedWorkout) {
        setSelectedWorkout(updatedWorkout);
        toast({
          title: updatedWorkout.completed ? 'Workout Completed' : 'Workout Incomplete',
          description: updatedWorkout.completed 
            ? 'Great job! Your workout has been marked as complete.' 
            : 'Your workout has been marked as incomplete.',
        });
      }
    } catch (error) {
      console.error('Error toggling workout completion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update workout status',
        variant: 'destructive',
      });
    }
  };

  const getDayContent = (day: Date | undefined) => {
    if (!day) return null;
    
    const formattedDay = format(day, 'yyyy-MM-dd');
    const dayWorkout = workouts.find(w => w.date === formattedDay);
    
    if (dayWorkout) {
      return (
        <div className="relative w-full h-full">
          <div 
            className={`absolute bottom-0 left-0 right-0 h-2 ${dayWorkout.completed ? 'bg-green-500' : 'bg-blue-500'}`}
          />
        </div>
      );
    }
    
    return null;
  };

  // Load workouts for selected date on component mount
  useEffect(() => {
    if (selectedDate) {
      handleDateSelect(selectedDate);
    }
  }, [workouts]);

  const getTypeClass = (type: WorkoutType) => {
    switch (type) {
      case 'strength':
        return 'bg-blue-100 text-blue-800';
      case 'cardio':
        return 'bg-red-100 text-red-800';
      case 'mobility':
        return 'bg-green-100 text-green-800';
      case 'other':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Workout Calendar</h2>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={currentMonth}
          className="rounded-md border"
          components={{
            DayContent: ({ day }) => getDayContent(day)
          }}
        />
      </div>

      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Selected Day</h2>
        {selectedDate ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</CardTitle>
                {selectedWorkout && (
                  <Badge className={getTypeClass(selectedWorkout.type)}>
                    {selectedWorkout.type}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedWorkout ? (
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <Textarea
                        value={selectedWorkout.note || ''}
                        onChange={(e) => setSelectedWorkout({
                          ...selectedWorkout,
                          note: e.target.value
                        })}
                        placeholder="Workout notes..."
                        className="min-h-[100px] w-full"
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="completed" 
                          checked={selectedWorkout.completed}
                          onCheckedChange={(checked) => setSelectedWorkout({
                            ...selectedWorkout,
                            completed: !!checked
                          })}
                        />
                        <Label htmlFor="completed">Mark as completed</Label>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateWorkout}>
                          Save Changes
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-muted p-4 rounded-md">
                        {selectedWorkout.note || 'No notes for this workout.'}
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleToggleComplete}
                            className={selectedWorkout.completed ? "text-green-600" : ""}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            {selectedWorkout.completed ? "Completed" : "Mark Complete"}
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={handleDeleteWorkout}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p>No workout planned for this day. Would you like to add one?</p>
                  <Dialog open={createWorkoutOpen} onOpenChange={setCreateWorkoutOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Workout
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a new workout</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="custom">
                        <TabsList className="grid grid-cols-1 mb-4">
                          <TabsTrigger value="custom">Custom Workout</TabsTrigger>
                        </TabsList>
                        <TabsContent value="custom" className="space-y-4">
                          <Textarea
                            placeholder="Workout notes and details..."
                            value={newWorkoutNote}
                            onChange={(e) => setNewWorkoutNote(e.target.value)}
                            className="min-h-[100px] w-full"
                          />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <Button onClick={() => handleAddWorkout('strength')} className="bg-blue-600 hover:bg-blue-700">
                              Strength
                            </Button>
                            <Button onClick={() => handleAddWorkout('cardio')} className="bg-red-600 hover:bg-red-700">
                              Cardio
                            </Button>
                            <Button onClick={() => handleAddWorkout('mobility')} className="bg-green-600 hover:bg-green-700">
                              Mobility
                            </Button>
                            <Button onClick={() => handleAddWorkout('other')} className="bg-purple-600 hover:bg-purple-700">
                              Other
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p>Please select a date to view or add a workout.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 