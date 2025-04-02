
import React from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { WorkoutPreset } from '@/types/workout';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PresetSelectorProps {
  onPresetSelected?: (presetId: string) => void;
  buttonText?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ 
  onPresetSelected, 
  buttonText = "Select Workout",
  variant = "outline"
}) => {
  const { workoutPresets, selectedDate, applyPresetToDate } = useWorkout();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handlePresetSelect = (preset: WorkoutPreset) => {
    applyPresetToDate(preset.id, selectedDate);
    if (onPresetSelected) {
      onPresetSelected(preset.id);
    }
    setDialogOpen(false);
  };

  const strengthPresets = workoutPresets.filter(preset => preset.type === 'Strength');
  const mobilityPresets = workoutPresets.filter(preset => preset.type === 'Mobility');
  const runningPresets = workoutPresets.filter(preset => preset.type === 'Running');

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Select Workout Preset</DialogTitle>
          <DialogDescription>
            Choose a workout preset for {format(selectedDate, 'EEEE, MMMM d')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="strength" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="mobility">Mobility</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strength" className="space-y-2 mt-2">
            {strengthPresets.map(preset => (
              <PresetButton 
                key={preset.id} 
                preset={preset} 
                onClick={() => handlePresetSelect(preset)} 
              />
            ))}
          </TabsContent>
          
          <TabsContent value="mobility" className="space-y-2 mt-2">
            {mobilityPresets.map(preset => (
              <PresetButton 
                key={preset.id} 
                preset={preset} 
                onClick={() => handlePresetSelect(preset)} 
              />
            ))}
          </TabsContent>
          
          <TabsContent value="running" className="space-y-2 mt-2">
            {runningPresets.map(preset => (
              <PresetButton 
                key={preset.id} 
                preset={preset} 
                onClick={() => handlePresetSelect(preset)} 
              />
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface PresetButtonProps {
  preset: WorkoutPreset;
  onClick: () => void;
}

const PresetButton: React.FC<PresetButtonProps> = ({ preset, onClick }) => {
  return (
    <Button 
      key={preset.id}
      variant="outline"
      className={cn(
        "w-full justify-start font-normal h-auto py-3",
        {
          'border-strength text-strength': preset.type === 'Strength',
          'border-mobility text-mobility': preset.type === 'Mobility',
          'border-running text-running': preset.type === 'Running',
        }
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <Badge className={cn("mr-2", {
            'bg-strength text-white': preset.type === 'Strength',
            'bg-mobility text-white': preset.type === 'Mobility',
            'bg-running text-white': preset.type === 'Running',
          })}>
            {preset.type}
          </Badge>
          <span className="font-medium">{preset.name}</span>
        </div>
        {preset.description && (
          <span className="text-xs text-muted-foreground mt-1 ml-12">{preset.description}</span>
        )}
      </div>
    </Button>
  );
};

export default PresetSelector;
