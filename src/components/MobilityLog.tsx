
import { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MobilityExercise } from '../types/workout';

const MobilityLog = () => {
  const { mobilityExercises, updateMobilityExercise } = useWorkout();
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleInputChange = (index: number, field: keyof MobilityExercise, value: string) => {
    updateMobilityExercise(index, { [field]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Mobility Log</CardTitle>
            <CardDescription>
              Track your mobility and flexibility work
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="text-mobility border-mobility"
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
                <TableHead>Duration (min)</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mobilityExercises.map((exercise, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{exercise.exercise}</TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input 
                        className="w-20 h-8"
                        value={exercise.duration || ''} 
                        onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
                      />
                    ) : (
                      exercise.duration || '-'
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

export default MobilityLog;
