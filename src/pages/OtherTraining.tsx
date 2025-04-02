import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Edit, Plus } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function OtherTraining() {
  const [activeTab, setActiveTab] = useState('log');

  const otherSessions = [
    {
      id: 1,
      type: 'Bouldering',
      date: '2023-04-01',
      duration: 120,
      difficulty: 'V3-V4',
      notes: 'Focused on slab problems and overhangs'
    },
    {
      id: 2,
      type: 'Soccer',
      date: '2023-04-04',
      duration: 90,
      difficulty: 'Medium',
      notes: 'Team practice, worked on passing drills and scrimmage'
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Other Activities</h1>
      <p className="text-muted-foreground mb-8">
        Track your other physical activities such as sports, climbing, and more
      </p>

      <Tabs defaultValue="log" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="log">Activity Log</TabsTrigger>
          <TabsTrigger value="stats">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Activity Log</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Activity
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration (min)</TableHead>
                  <TableHead>Intensity/Difficulty</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        {session.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>{session.difficulty}</TableCell>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bouldering</CardTitle>
                <CardDescription>Indoor and outdoor climbing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Session Duration</span>
                    <span>2-3 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Grade Range</span>
                    <span>V3-V5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Project</span>
                    <span>Red V5 in the cave</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Activity Details</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Soccer</CardTitle>
                <CardDescription>Team practice and matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Session Duration</span>
                    <span>90 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Frequency</span>
                    <span>Weekly</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Position</span>
                    <span>Midfielder</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Activity Details</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 