import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Edit, Plus } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export function MobilityTraining() {
  const [activeTab, setActiveTab] = useState('log');

  const mobilitySessions = [
    {
      id: 1,
      type: 'Hip Mobility Routine',
      date: '2023-04-02',
      duration: 25,
      focus: 'Hip flexors and adductors',
      notes: 'Added PNF stretching, felt much better afterwards'
    },
    {
      id: 2,
      type: 'Shoulder Mobility',
      date: '2023-04-05',
      duration: 15,
      focus: 'Rotator cuff and scapular stability',
      notes: 'Used bands for resistance, worked on overhead position'
    }
  ];

  const mobilityGoals = [
    { area: 'Hamstring Flexibility', current: 80, target: 100, unit: 'Degrees' },
    { area: 'Shoulder External Rotation', current: 65, target: 90, unit: 'Degrees' },
    { area: 'Ankle Dorsiflexion', current: 20, target: 35, unit: 'Degrees' }
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Mobility Training</h1>
      <p className="text-muted-foreground mb-8">
        Track your mobility work, flexibility goals, and progress
      </p>

      <Tabs defaultValue="log" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="log">Mobility Log</TabsTrigger>
          <TabsTrigger value="goals">Mobility Goals</TabsTrigger>
          <TabsTrigger value="routines">Mobility Routines</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Mobility Log</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Session
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration (min)</TableHead>
                  <TableHead>Focus Areas</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mobilitySessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {session.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>{session.focus}</TableCell>
                    <TableCell className="max-w-xs truncate">{session.notes}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Mobility Goals</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Goal
            </Button>
          </div>
          
          <div className="space-y-6">
            {mobilityGoals.map((goal, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{goal.area}</CardTitle>
                  <CardDescription>Current: {goal.current}{goal.unit} / Target: {goal.target}{goal.unit}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  <p className="text-right text-sm text-muted-foreground mt-2">
                    {Math.round((goal.current / goal.target) * 100)}% of goal
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Update Measurement</Button>
                  <Button variant="ghost" size="sm">Edit Goal</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="routines">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Mobility Routines</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Routine
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Full Body Mobility</CardTitle>
                <CardDescription>15-minute daily mobility routine</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Neck circles and shoulder rolls (1 min)</li>
                  <li>Thoracic spine rotations (2 min)</li>
                  <li>Hip circles and leg swings (3 min)</li>
                  <li>Ankle mobility drills (2 min)</li>
                  <li>Wrist mobility exercises (2 min)</li>
                  <li>Squat holds with rotations (3 min)</li>
                  <li>Cool down stretches (2 min)</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Routine</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hip Mobility Flow</CardTitle>
                <CardDescription>Focus on hip mobility and flexibility</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Standing hip rotations (2 min)</li>
                  <li>Lizard pose with variations (4 min)</li>
                  <li>Hip flexor stretch progression (4 min)</li>
                  <li>Pigeon pose hold (3 min per side)</li>
                  <li>90/90 hip stretch (4 min)</li>
                  <li>Frog stretch (2 min)</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Routine</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 