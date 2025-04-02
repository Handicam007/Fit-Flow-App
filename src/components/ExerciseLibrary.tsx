import { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useExerciseLibrary } from '../hooks/useExerciseLibrary';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
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
} from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../components/ui/use-toast';

export function ExerciseLibrary() {
  const { exercises, categories, loading, addExercise, updateExercise, deleteExercise } = useExerciseLibrary();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const { toast } = useToast();

  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    category_id: '',
  });

  const handleAddExercise = async () => {
    try {
      await addExercise({
        name: newExercise.name,
        description: newExercise.description,
        category_id: newExercise.category_id,
      });
      
      setNewExercise({ name: '', description: '', category_id: '' });
      toast({
        title: 'Success',
        description: 'Exercise added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add exercise',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateExercise = async () => {
    if (!editingExercise) return;
    
    try {
      await updateExercise(editingExercise.id, {
        name: editingExercise.name,
        description: editingExercise.description,
        category_id: editingExercise.category_id,
      });
      
      setEditingExercise(null);
      toast({
        title: 'Success',
        description: 'Exercise updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update exercise',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await deleteExercise(id);
      toast({
        title: 'Success',
        description: 'Exercise deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete exercise',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue={categories[0]?.id} className="w-full">
        <TabsList className="w-full justify-start">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {exercises
                .filter((exercise) => exercise.category_id === category.id)
                .map((exercise) => (
                  <Card key={exercise.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{exercise.name}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingExercise(exercise)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExercise(exercise.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}

              {/* Add Exercise Card */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:bg-muted">
                    <CardHeader className="flex items-center justify-center h-full">
                      <Plus className="h-8 w-8" />
                      <CardTitle>Add Exercise</CardTitle>
                    </CardHeader>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Exercise</DialogTitle>
                    <DialogDescription>
                      Add a new exercise to your library
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Exercise Name"
                      value={newExercise.name}
                      onChange={(e) =>
                        setNewExercise({ ...newExercise, name: e.target.value })
                      }
                    />
                    <Textarea
                      placeholder="Exercise Description"
                      value={newExercise.description}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          description: e.target.value,
                        })
                      }
                    />
                    <Button
                      onClick={() => {
                        setNewExercise({ ...newExercise, category_id: category.id });
                        handleAddExercise();
                      }}
                      className="w-full"
                    >
                      Add Exercise
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Exercise Dialog */}
      <Dialog open={!!editingExercise} onOpenChange={() => setEditingExercise(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogDescription>
              Update exercise details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Exercise Name"
              value={editingExercise?.name || ''}
              onChange={(e) =>
                setEditingExercise({ ...editingExercise, name: e.target.value })
              }
            />
            <Textarea
              placeholder="Exercise Description"
              value={editingExercise?.description || ''}
              onChange={(e) =>
                setEditingExercise({
                  ...editingExercise,
                  description: e.target.value,
                })
              }
            />
            <Button onClick={handleUpdateExercise} className="w-full">
              Update Exercise
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 