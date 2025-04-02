
import { useState } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RunningSession } from '@/types/workout';

const RunningLog = () => {
  const { runningSessions, updateRunningSession } = useWorkout();
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleInputChange = (index: number, field: keyof RunningSession, value: string) => {
    updateRunningSession(index, { [field]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Running Log</CardTitle>
            <CardDescription>
              Track your running sessions
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="text-running border-running"
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
                <TableHead>Type</TableHead>
                <TableHead>Distance (km)</TableHead>
                <TableHead>Duration (min)</TableHead>
                <TableHead>Avg Pace (min/km)</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runningSessions.map((session, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{session.type}</TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input 
                        className="w-20 h-8"
                        value={session.distance || ''} 
                        onChange={(e) => handleInputChange(index, 'distance', e.target.value)}
                      />
                    ) : (
                      session.distance || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input 
                        className="w-20 h-8"
                        value={session.duration || ''} 
                        onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
                      />
                    ) : (
                      session.duration || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input 
                        className="w-20 h-8"
                        value={session.pace || ''} 
                        onChange={(e) => handleInputChange(index, 'pace', e.target.value)}
                      />
                    ) : (
                      session.pace || '-'
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {editMode ? (
                      <Input 
                        className="w-full h-8"
                        value={session.notes || ''} 
                        onChange={(e) => handleInputChange(index, 'notes', e.target.value)}
                      />
                    ) : (
                      session.notes || '-'
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

export default RunningLog;
