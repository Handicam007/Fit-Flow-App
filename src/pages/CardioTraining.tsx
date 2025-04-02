import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CardioTraining() {
  const [activeTab, setActiveTab] = useState('log');

  const cardioSessions = [
    {
      id: 1,
      type: 'Zone 2 Run',
      date: '2023-04-02',
      duration: 45,
      distance: 7.5,
      pace: '6:00',
      notes: 'Keep HR 60-70% of max; conversational pace'
    },
    {
      id: 2,
      type: 'Interval Training',
      date: '2023-04-05',
      duration: 30,
      distance: 5.2,
      pace: '5:45',
      notes: '30 sec sprint, 90 sec jog x 8'
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Cardio Training</h1>
      <p className="text-muted-foreground mb-8">
        Track your cardio sessions and performance metrics
      </p>

      <Tabs defaultValue="log" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="log">Training Log</TabsTrigger>
          <TabsTrigger value="stats">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Running Log</h2>
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
                  <TableHead>Distance (km)</TableHead>
                  <TableHead>Avg Pace (min/km)</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cardioSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {session.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>{session.distance}</TableCell>
                    <TableCell>{session.pace}</TableCell>
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
                <CardTitle>Zone 2 Run</CardTitle>
                <CardDescription>Low intensity steady state cardio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Duration</span>
                    <span>30-40 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Target Heart Rate</span>
                    <span>60-70% of max HR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pace</span>
                    <span>Conversational</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Workout Details</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Long Run</CardTitle>
                <CardDescription>Extended cardio session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Starting Distance</span>
                    <span>5 km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Progression</span>
                    <span>Increase by 1 km weekly</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Notes</span>
                    <span>Keep pace consistent</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Workout Details</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 