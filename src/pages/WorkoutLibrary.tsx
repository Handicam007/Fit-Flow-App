import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutTemplates } from "@/components/WorkoutTemplates";
import { useState } from "react";

export function WorkoutLibrary() {
  const [activeTab, setActiveTab] = useState("Strength");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Workout Library</h1>
      <p className="text-muted-foreground mb-8">
        Browse our library of workout templates by category. Select a template to view details or add it to your calendar.
      </p>

      <Tabs defaultValue="Strength" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-4 w-[400px]">
            <TabsTrigger value="Strength">Strength</TabsTrigger>
            <TabsTrigger value="Cardio">Cardio</TabsTrigger>
            <TabsTrigger value="Mobility">Mobility</TabsTrigger>
            <TabsTrigger value="Other">Other</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">{activeTab} Workouts</h2>
          <WorkoutTemplates showActions={true} />
        </div>
      </Tabs>
    </div>
  );
} 