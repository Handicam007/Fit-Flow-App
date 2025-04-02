
import { useState } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StrengthExercise } from '@/types/workout';

const StrengthTrainingLog = () => {
  const { strengthExercises, updateStrengthExercise } = useWorkout();
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleInputChange = (index: number, field: keyof StrengthExercise, value: string) => {
    updateStrengthExercise(index, { [field]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Strength Training Log</CardTitle>
            <CardDescription>
              Track your strength training exercises
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="text-strength border-strength"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Save' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Sets</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strengthExercises.map((exercise, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{exercise.exercise}</TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input 
                        className="w-16 h-8"
                        value={exercise.sets} 
                        onChange={(e) => handleInputChange(index, 'sets', e.target.value)}
                      />
                    ) : (
                      exercise.sets
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input 
                        className="w-24 h-8"
                        value={exercise.reps} 
                        onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
                      />
                    ) : (
                      exercise.reps
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input 
                        className="w-20 h-8"
                        value={exercise.weight || ''} 
                        onChange={(e) => handleInputChange(index, 'weight', e.target.value)}
                      />
                    ) : (
                      exercise.weight || '-'
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {editMode ? (
                      <Input 
                        className="w-full h-8"
                        value={exercise.notes || ''} 
                        onChange={(e) => handleInputChange(index, 'notes', e.target.value)}
                      />
                    ) : (
                      exercise.notes || '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrengthTrainingLog;
