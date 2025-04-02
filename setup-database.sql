-- Create workout_type enum
CREATE TYPE workout_type AS ENUM ('strength', 'cardio', 'mobility', 'other');

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  default_sets INTEGER,
  default_reps INTEGER,
  default_weight DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Workout Templates Table
CREATE TABLE IF NOT EXISTS workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type workout_type NOT NULL,
  category TEXT NOT NULL,
  exercises JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Workouts Table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  type workout_type NOT NULL,
  completed BOOLEAN DEFAULT false,
  note TEXT,
  exercises JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Sample Categories
INSERT INTO categories (name) VALUES
  ('Upper Body'),
  ('Lower Body'),
  ('Core'),
  ('Cardio'),
  ('Mobility'),
  ('Full Body')
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Exercises
INSERT INTO exercises (name, description, category_id, default_sets, default_reps, default_weight) VALUES
  ('Bench Press', 'Barbell chest press lying on a bench', (SELECT id FROM categories WHERE name = 'Upper Body'), 3, 10, 135),
  ('Squat', 'Barbell squat', (SELECT id FROM categories WHERE name = 'Lower Body'), 3, 8, 185),
  ('Deadlift', 'Barbell deadlift', (SELECT id FROM categories WHERE name = 'Lower Body'), 3, 5, 225),
  ('Pull Up', 'Bodyweight pull up', (SELECT id FROM categories WHERE name = 'Upper Body'), 3, 8, NULL),
  ('Plank', 'Core stability exercise', (SELECT id FROM categories WHERE name = 'Core'), 3, 1, NULL),
  ('Running', 'Outdoor or treadmill running', (SELECT id FROM categories WHERE name = 'Cardio'), NULL, NULL, NULL),
  ('Hip Opener', 'Stretching exercise for hip mobility', (SELECT id FROM categories WHERE name = 'Mobility'), 1, 1, NULL),
  ('Push Up', 'Bodyweight chest exercise', (SELECT id FROM categories WHERE name = 'Upper Body'), 3, 12, NULL),
  ('Lunge', 'Single leg lower body exercise', (SELECT id FROM categories WHERE name = 'Lower Body'), 3, 10, NULL),
  ('Bicycle Crunch', 'Dynamic core exercise', (SELECT id FROM categories WHERE name = 'Core'), 3, 15, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Workout Templates
INSERT INTO workout_templates (name, description, type, category, exercises) VALUES
  ('Upper Body Strength', 'Focus on chest, shoulders, and back', 'strength', 'Strength', '[{"exercise_id":"Bench Press","details":{"sets":4,"reps":10,"weight":135}},{"exercise_id":"Pull Up","details":{"sets":3,"reps":8}}]'),
  ('5K Run Training', 'Interval training for 5K preparation', 'cardio', 'Cardio', '[{"exercise_id":"Running","details":{"duration":30,"distance":5}}]'),
  ('Full Body Mobility', 'Improve flexibility and range of motion', 'mobility', 'Mobility', '[{"exercise_id":"Hip Opener","details":{"duration":10}}]'),
  ('Recovery Yoga', 'Gentle yoga flow for recovery days', 'other', 'Other', '[]'),
  ('Lower Body Power', 'Build lower body strength and power', 'strength', 'Strength', '[{"exercise_id":"Squat","details":{"sets":5,"reps":5,"weight":185}},{"exercise_id":"Deadlift","details":{"sets":3,"reps":5,"weight":225}}]'),
  ('Core Stability', 'Strengthen your core and improve stability', 'strength', 'Strength', '[{"exercise_id":"Plank","details":{"sets":3,"duration":60}},{"exercise_id":"Bicycle Crunch","details":{"sets":3,"reps":15}}]')
ON CONFLICT (id) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category_id);

-- Add triggers to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_exercises_timestamp
BEFORE UPDATE ON exercises
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_workout_templates_timestamp
BEFORE UPDATE ON workout_templates
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_workouts_timestamp
BEFORE UPDATE ON workouts
FOR EACH ROW EXECUTE FUNCTION update_timestamp(); 