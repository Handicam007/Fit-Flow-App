-- Drop existing tables and types
DROP TABLE IF EXISTS workout_exercises CASCADE;
DROP TABLE IF EXISTS template_exercises CASCADE;
DROP TABLE IF EXISTS workout_templates CASCADE;
DROP TABLE IF EXISTS workout_logs CASCADE;
DROP TABLE IF EXISTS workout_presets CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TYPE IF EXISTS workout_type CASCADE;

-- Create enum type for workout types
CREATE TYPE workout_type AS ENUM ('strength', 'cardio', 'mobility', 'running');

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  default_sets INTEGER DEFAULT 3,
  default_reps INTEGER DEFAULT 10,
  default_weight DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  title TEXT,
  type workout_type,
  completed BOOLEAN DEFAULT false,
  note TEXT,
  exercises JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout_presets table
CREATE TABLE IF NOT EXISTS workout_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type workout_type,
  description TEXT,
  exercises JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  completed_exercises JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout_templates table
CREATE TABLE IF NOT EXISTS workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create template_exercises table to store exercises in templates
CREATE TABLE IF NOT EXISTS template_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  weight DECIMAL DEFAULT 0,
  duration INTEGER, -- in seconds
  distance DECIMAL, -- in meters/kilometers
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_exercises table to store exercise details for each workout
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  weight DECIMAL DEFAULT 0,
  duration INTEGER, -- in seconds
  distance DECIMAL, -- in meters/kilometers
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all categories"
  ON categories FOR SELECT
  USING (true);

-- Create RLS policies for exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all exercises"
  ON exercises FOR SELECT
  USING (true);

CREATE POLICY "Users can create exercises"
  ON exercises FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update exercises"
  ON exercises FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete exercises"
  ON exercises FOR DELETE
  USING (true);

-- Create RLS policies for workouts
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their workouts"
  ON workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their workouts"
  ON workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their workouts"
  ON workouts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their workouts"
  ON workouts FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for workout_presets
ALTER TABLE workout_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their presets"
  ON workout_presets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their presets"
  ON workout_presets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their presets"
  ON workout_presets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their presets"
  ON workout_presets FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for workout_logs
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their workout logs"
  ON workout_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their workout logs"
  ON workout_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their workout logs"
  ON workout_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their workout logs"
  ON workout_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for workout_templates
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all templates"
  ON workout_templates FOR SELECT
  USING (true);

CREATE POLICY "Users can create templates"
  ON workout_templates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their templates"
  ON workout_templates FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their templates"
  ON workout_templates FOR DELETE
  USING (true);

-- Create RLS policies for template_exercises
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all template exercises"
  ON template_exercises FOR SELECT
  USING (true);

CREATE POLICY "Users can create template exercises"
  ON template_exercises FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their template exercises"
  ON template_exercises FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their template exercises"
  ON template_exercises FOR DELETE
  USING (true);

-- Create RLS policies for workout_exercises
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all workout exercises"
  ON workout_exercises FOR SELECT
  USING (true);

CREATE POLICY "Users can create workout exercises"
  ON workout_exercises FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their workout exercises"
  ON workout_exercises FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their workout exercises"
  ON workout_exercises FOR DELETE
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workout_presets_updated_at
  BEFORE UPDATE ON workout_presets
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workout_logs_updated_at
  BEFORE UPDATE ON workout_logs
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at
  BEFORE UPDATE ON workout_templates
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_template_exercises_updated_at
  BEFORE UPDATE ON template_exercises
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workout_exercises_updated_at
  BEFORE UPDATE ON workout_exercises
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column(); 