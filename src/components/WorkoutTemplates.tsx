import { useState } from 'react';
import { Plus, Save, Trash, PlusSquare, Edit, Loader2 } from 'lucide-react';
import { useWorkoutTemplates } from '../hooks/useWorkoutTemplates';
import { useExerciseLibrary } from '../hooks/useExerciseLibrary';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ExerciseDetails } from '../components/ExerciseDetails';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { useToast } from '../components/ui/use-toast';
import { WorkoutTemplate, ExerciseDetails as ExerciseDetailsType, WorkoutType } from '../types/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';

interface TemplateExercise {
  exercise_id: string;
  details: Partial<ExerciseDetailsType>;
}

interface WorkoutTemplatesProps {
  onSelectTemplate?: (template: WorkoutTemplate) => void;
  showActions?: boolean;
  selectedDate?: Date;
  activeTab?: string;
}

export function WorkoutTemplates({ 
  onSelectTemplate, 
  showActions = true,
  selectedDate,
  activeTab = 'all'
}: WorkoutTemplatesProps) {
  const { templates, createTemplate, updateTemplate, deleteTemplate, loading, error, createWorkoutFromTemplate } = useWorkoutTemplates();
  const { exercises, categories, loading: loadingExercises } = useExerciseLibrary();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    exercises: [] as TemplateExercise[],
  });
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  // Categories for tabs
  const workoutCategories = ['Strength', 'Cardio', 'Mobility', 'Other'];

  // Function to get the CSS class for the workout type badge
  const getTypeClass = (type: string) => {
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

  const handleCreateTemplate = async () => {
    if (!createTemplate) {
      toast({
        title: 'Feature unavailable',
        description: 'Template creation is not available at this time.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await createTemplate({
        name: newTemplate.name,
        description: newTemplate.description,
        exercises: newTemplate.exercises,
        type: 'strength' as WorkoutType, // Default type
        category: 'Strength', // Default category
      });
      
      setNewTemplate({ name: '', description: '', exercises: [] });
      toast({
        title: 'Success',
        description: 'Template created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!updateTemplate || !selectedTemplate) {
      toast({
        title: 'Feature unavailable',
        description: 'Template updating is not available at this time.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await updateTemplate(selectedTemplate.id, {
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        exercises: selectedTemplate.exercises,
      });
      
      setSelectedTemplate(null);
      toast({
        title: 'Success',
        description: 'Template updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update template',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!deleteTemplate) {
      toast({
        title: 'Feature unavailable',
        description: 'Template deletion is not available at this time.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await deleteTemplate(id);
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };

  const handleExerciseDetailsChange = (exerciseId: string, details: Partial<ExerciseDetailsType>) => {
    if (selectedTemplate) {
      const updatedExercises = selectedTemplate.exercises.map(ex =>
        ex.exercise_id === exerciseId ? { ...ex, details } : ex
      );
      setSelectedTemplate({ ...selectedTemplate, exercises: updatedExercises });
    } else {
      const updatedExercises = newTemplate.exercises.map(ex =>
        ex.exercise_id === exerciseId ? { ...ex, details } : ex
      );
      setNewTemplate({ ...newTemplate, exercises: updatedExercises });
    }
  };

  const handleSelectTemplate = (template: WorkoutTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else {
      setSelectedTemplate(template);
      setShowDetails(true);
    }
  };

  const handleCreateWorkout = async () => {
    if (!createWorkoutFromTemplate || !selectedTemplate || !selectedDate) {
      toast({
        title: 'Feature unavailable',
        description: 'Workout creation is not available at this time.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const workout = await createWorkoutFromTemplate(selectedTemplate.id, formattedDate);
      
      if (workout) {
        toast({
          title: 'Workout scheduled',
          description: `${selectedTemplate.name} has been added to your calendar.`,
        });
        setShowDetails(false);
        navigate('/calendar');
      }
    } catch (error) {
      console.error('Error scheduling workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule workout',
        variant: 'destructive',
      });
    }
  };

  // Sample templates to show if no templates are available
  const sampleTemplates = [
    {
      id: 'sample-1',
      name: 'Upper Body Strength',
      description: 'Focus on chest, shoulders, and triceps',
      type: 'strength',
      category: 'Strength',
      exercises: []
    },
    {
      id: 'sample-2',
      name: '5K Run Training',
      description: 'Interval training for 5K preparation',
      type: 'cardio',
      category: 'Cardio',
      exercises: []
    },
    {
      id: 'sample-3',
      name: 'Full Body Mobility',
      description: 'Improve flexibility and joint mobility',
      type: 'mobility',
      category: 'Mobility',
      exercises: []
    }
  ];

  // Display templates based on filter
  const getFilteredTemplates = (type: string) => {
    const templateData = templates?.length ? templates : sampleTemplates;
    
    if (type === 'all') return templateData;
    return templateData.filter(template => template.type === type);
  };

  if (loading || loadingExercises) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading workout templates: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Workout Templates</h2>
        <Button onClick={() => setSelectedTemplate(null)}>
          <PlusSquare className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <Tabs defaultValue={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="mobility">Mobility</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        {['all', 'strength', 'cardio', 'mobility', 'other'].map((type) => (
          <TabsContent key={type} value={type}>
            {loading ? (
              <div className="text-center py-8">Loading templates...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Failed to load templates. Using sample data.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates(type).map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{template.name}</CardTitle>
                        <Badge className={getTypeClass(template.type)}>
                          {template.type}
                        </Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{template.category}</p>
                      <p className="text-sm mt-2">
                        {template.exercises?.length || 0} exercises
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleSelectTemplate(template)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {showDetails && selectedTemplate && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
              <DialogDescription>
                {selectedTemplate.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <h3 className="text-sm font-medium mb-2">Exercises:</h3>
              {selectedTemplate.exercises && selectedTemplate.exercises.length > 0 ? (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-4">
                    {selectedTemplate.exercises.map((exercise, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <p className="font-medium">{exercise.exercise_id}</p>
                        <div className="mt-2 text-sm">
                          {exercise.details && (
                            <div className="grid grid-cols-3 gap-2">
                              <p>Sets: {exercise.details.sets || 'N/A'}</p>
                              <p>Reps: {exercise.details.reps || 'N/A'}</p>
                              <p>Weight: {exercise.details.weight || 'N/A'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">No exercises defined for this template.</p>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              {selectedDate && (
                <Button onClick={handleCreateWorkout}>
                  Schedule Workout
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 