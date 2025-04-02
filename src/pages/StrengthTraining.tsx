import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Edit, Plus, Clock, Dumbbell, LineChart } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export function StrengthTraining() {
  const [activeTab, setActiveTab] = useState('log');

  const strengthSessions = [
    {
      id: 1,
      workout: 'Upper Body Strength',
      date: '2023-04-03',
      duration: 65,
      exercises: 'Bench Press, Pull-ups, OHP, Rows',
      notes: 'Increased bench press by 5lbs'
    },
    {
      id: 2,
      workout: 'Lower Body Strength',
      date: '2023-04-06',
      duration: 75,
      exercises: 'Squats, RDL, Lunges, Calf Raises',
      notes: 'Focused on form for RDLs'
    }
  ];

  const strengthGoals = [
    { exercise: 'Bench Press', current: 225, target: 275, unit: 'lbs' },
    { exercise: 'Squat', current: 315, target: 405, unit: 'lbs' },
    { exercise: 'Deadlift', current: 365, target: 455, unit: 'lbs' },
    { exercise: 'Pull-ups', current: 12, target: 20, unit: 'reps' }
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Strength Training</h1>
      <p className="text-muted-foreground mb-8">
        Track your strength workouts, exercises, and progress toward your goals
      </p>

      <Tabs defaultValue="log" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="log">Workout Log</TabsTrigger>
          <TabsTrigger value="stats">Strength Stats</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Workout Log</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Workout
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workout</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration (min)</TableHead>
                  <TableHead>Exercises</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strengthSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {session.workout}
                      </Badge>
                    </TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell className="max-w-xs truncate">{session.exercises}</TableCell>
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

        <TabsContent value="stats">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Strength Goals</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Goal
            </Button>
          </div>
          
          <div className="space-y-6">
            {strengthGoals.map((goal, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{goal.exercise}</CardTitle>
                  <CardDescription>Current: {goal.current}{goal.unit} / Target: {goal.target}{goal.unit}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  <p className="text-right text-sm text-muted-foreground mt-2">
                    {Math.round((goal.current / goal.target) * 100)}% of goal
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Update PR</Button>
                  <Button variant="ghost" size="sm">View History</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programs">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Training Programs</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Program
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>5/3/1 Program</CardTitle>
                <CardDescription>Four-day split focusing on compound lifts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="h-5 w-5 text-muted-foreground" />
                    <span>Main lifts: Squat, Bench, Deadlift, OHP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>4 days per week, 45-60 min sessions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5 text-muted-foreground" />
                    <span>Progressive overload with 3-week cycles</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Program</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push/Pull/Legs</CardTitle>
                <CardDescription>Six-day split for hypertrophy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="h-5 w-5 text-muted-foreground" />
                    <span>Balanced focus on all muscle groups</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>6 days per week, 60-75 min sessions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5 text-muted-foreground" />
                    <span>High volume for maximum hypertrophy</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Program</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 