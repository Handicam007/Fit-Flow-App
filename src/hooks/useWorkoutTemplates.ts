import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { WorkoutTemplate, WorkoutType } from '../types/supabase';
import { useToast } from '../components/ui/use-toast';

// Sample template data if no templates are available
const sampleTemplates = [
  {
    id: '1',
    name: 'Upper Body Strength',
    description: 'Build upper body strength with compound movements',
    category: 'Strength',
    type: 'strength' as WorkoutType,
    exercises: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: '5K Run',
    description: 'Basic 5K running workout with warmup and cooldown',
    category: 'Cardio',
    type: 'cardio' as WorkoutType,
    exercises: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Full Body Mobility',
    description: 'Improve flexibility and mobility across all joints',
    category: 'Mobility',
    type: 'mobility' as WorkoutType,
    exercises: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useWorkoutTemplates = () => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if table exists/can be accessed first
      const { data, error } = await supabase
        .from('workout_templates')
        .select('*');
      
      if (error) {
        console.warn('Error fetching workout templates:', error.message);
        setError(new Error(error.message));
        setTemplates(sampleTemplates);
        toast({
          title: "Using sample templates",
          description: "Database connection unavailable. Using sample data.",
        });
      } else {
        setTemplates(data || []);
        
        if (!data || data.length === 0) {
          console.log('No templates found, using samples');
          setTemplates(sampleTemplates);
        }
      }
    } catch (err: any) {
      console.error('Exception fetching templates:', err);
      setError(err);
      setTemplates(sampleTemplates);
      toast({
        title: "Error loading templates",
        description: "Using sample data instead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (template: Omit<WorkoutTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTemplate = {
        ...template,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('workout_templates')
        .insert([newTemplate])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setTemplates(prev => [...prev, data as WorkoutTemplate]);
      return data as WorkoutTemplate;
    } catch (err: any) {
      console.error('Error creating template:', err);
      toast({
        title: "Error creating template",
        description: err.message || "Failed to create workout template",
        variant: "destructive",
      });
      
      // Create a mock template for offline mode
      const mockTemplate = {
        ...template,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as WorkoutTemplate;
      
      setTemplates(prev => [...prev, mockTemplate]);
      return mockTemplate;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<WorkoutTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('workout_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setTemplates(prev => prev.map(template => 
        template.id === id ? (data as WorkoutTemplate) : template
      ));
      return data as WorkoutTemplate;
    } catch (err: any) {
      console.error('Error updating template:', err);
      toast({
        title: "Error updating template",
        description: err.message || "Failed to update workout template",
        variant: "destructive",
      });
      
      // Update locally for offline mode
      const updatedTemplate = {
        ...templates.find(t => t.id === id),
        ...updates,
        updated_at: new Date().toISOString()
      } as WorkoutTemplate;
      
      setTemplates(prev => prev.map(template => 
        template.id === id ? updatedTemplate : template
      ));
      return updatedTemplate;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workout_templates')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTemplates(prev => prev.filter(template => template.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting template:', err);
      toast({
        title: "Error deleting template",
        description: err.message || "Failed to delete workout template",
        variant: "destructive",
      });
      
      // Delete locally for offline mode
      setTemplates(prev => prev.filter(template => template.id !== id));
      return true;
    }
  };

  // Create a workout from a template
  const createWorkoutFromTemplate = async (templateId: string, date: string, userId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      const workout = {
        user_id: userId,
        date,
        title: template.name,
        type: template.type,
        completed: false,
        note: template.description,
        exercises: template.exercises || []
      };
      
      const { data, error } = await supabase
        .from('workouts')
        .insert([workout])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error creating workout from template:', err);
      toast({
        title: "Error creating workout",
        description: err.message || "Failed to create workout from template",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates, 
    loading, 
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createWorkoutFromTemplate,
    refreshTemplates: fetchTemplates
  };
}; 