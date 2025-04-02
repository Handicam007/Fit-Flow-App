import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ExerciseDetails as ExerciseDetailsType } from '../types/supabase';

interface ExerciseDetailsProps {
  exerciseId: string;
  exerciseName: string;
  initialDetails?: Partial<ExerciseDetailsType>;
  onChange?: (exerciseId: string, details: Partial<ExerciseDetailsType>) => void;
}

export function ExerciseDetails({
  exerciseId,
  exerciseName,
  initialDetails = {},
  onChange,
}: ExerciseDetailsProps) {
  const [details, setDetails] = useState<Partial<ExerciseDetailsType>>(initialDetails);

  useEffect(() => {
    setDetails(initialDetails);
  }, [initialDetails, exerciseId]);

  const handleChange = (key: keyof ExerciseDetailsType, value: any) => {
    const numValue = key === 'notes' ? value : Number(value);
    const updatedDetails = { ...details, [key]: numValue };
    setDetails(updatedDetails);
    
    if (onChange) {
      onChange(exerciseId, updatedDetails);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="py-3">
        <CardTitle className="text-lg">{exerciseName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${exerciseId}-sets`}>Sets</Label>
            <Input
              id={`${exerciseId}-sets`}
              type="number"
              value={details.sets || ''}
              onChange={(e) => handleChange('sets', e.target.value)}
              placeholder="Sets"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor={`${exerciseId}-reps`}>Reps</Label>
            <Input
              id={`${exerciseId}-reps`}
              type="number"
              value={details.reps || ''}
              onChange={(e) => handleChange('reps', e.target.value)}
              placeholder="Reps"
              min="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${exerciseId}-weight`}>Weight (lbs)</Label>
            <Input
              id={`${exerciseId}-weight`}
              type="number"
              value={details.weight || ''}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="Weight"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor={`${exerciseId}-duration`}>Duration (min)</Label>
            <Input
              id={`${exerciseId}-duration`}
              type="number"
              value={details.duration || ''}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="Duration"
              min="0"
            />
          </div>
        </div>
        <div>
          <Label htmlFor={`${exerciseId}-notes`}>Notes</Label>
          <Input
            id={`${exerciseId}-notes`}
            value={details.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional notes"
          />
        </div>
      </CardContent>
    </Card>
  );
} 