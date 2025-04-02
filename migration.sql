-- Drop type if exists and recreate
DROP TYPE IF EXISTS workout_type CASCADE;
CREATE TYPE workout_type AS ENUM ('strength', 'cardio', 'mobility', 'other');

-- Create workout_presets table if it doesn't exist
CREATE TABLE IF NOT EXISTS workout_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type workout_type NOT NULL,
    user_id UUID,
    exercises JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table if it doesn't exist
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercises table if it doesn't exist
DROP TABLE IF EXISTS exercises CASCADE;
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    default_sets INTEGER DEFAULT 1,
    default_reps INTEGER DEFAULT 1,
    default_weight DECIMAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workouts table if it doesn't exist
DROP TABLE IF EXISTS workouts CASCADE;
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    type workout_type NOT NULL,
    completed BOOLEAN DEFAULT false,
    note TEXT,
    exercises JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout_templates table for preset workouts by category
CREATE TABLE IF NOT EXISTS workout_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type workout_type NOT NULL,
    category TEXT NOT NULL,
    exercises JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name) 
VALUES 
    ('Strength'),
    ('Cardio'),
    ('Mobility'),
    ('Other'),
    ('Climbing')
ON CONFLICT (name) DO NOTHING;

-- Insert basic exercises
INSERT INTO exercises (name, description, category_id, default_sets, default_reps)
SELECT 
    'Push-ups',
    'Basic push-up movement',
    c.id,
    3,
    12
FROM categories c
WHERE c.name = 'Strength'
AND NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Push-ups')
UNION ALL
SELECT 
    'Pull-ups',
    'Basic pull-up movement',
    c.id,
    3,
    8
FROM categories c
WHERE c.name = 'Strength'
UNION ALL
SELECT 
    'Core Circuit',
    'Plank, hollow body, and dead bugs',
    c.id,
    3,
    45
FROM categories c
WHERE c.name = 'Strength'
UNION ALL
SELECT 
    'Zone 2 Cardio',
    'Low intensity steady state cardio (run, cycle, row, etc)',
    c.id,
    1,
    1
FROM categories c
WHERE c.name = 'Cardio'
UNION ALL
SELECT 
    'Dynamic Stretching',
    'Full body mobility routine',
    c.id,
    1,
    1
FROM categories c
WHERE c.name = 'Mobility'
UNION ALL
SELECT 
    'Bouldering Session',
    'Indoor or outdoor bouldering',
    c.id,
    1,
    1
FROM categories c
WHERE c.name = 'Climbing'
UNION ALL
SELECT 
    'Soccer',
    'Soccer training or match',
    c.id,
    1,
    1
FROM categories c
WHERE c.name = 'Other'
UNION ALL
SELECT 
    'Boxing',
    'Boxing training session',
    c.id,
    1,
    1
FROM categories c
WHERE c.name = 'Other';

-- Enable RLS
ALTER TABLE workout_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view all exercises" ON exercises;
    DROP POLICY IF EXISTS "Users can view all categories" ON categories;
    DROP POLICY IF EXISTS "Users can view all workout_templates" ON workout_templates;
    DROP POLICY IF EXISTS "Users can view their workout_presets" ON workout_presets;
    DROP POLICY IF EXISTS "Users can view their workouts" ON workouts;
    
    -- Create new policies
    CREATE POLICY "Users can view all exercises"
        ON exercises FOR SELECT
        USING (true);

    CREATE POLICY "Users can view all categories"
        ON categories FOR SELECT
        USING (true);
        
    CREATE POLICY "Users can view all workout_templates"
        ON workout_templates FOR SELECT
        USING (true);

    CREATE POLICY "Users can view all workout_presets"
        ON workout_presets FOR SELECT
        USING (true);

    CREATE POLICY "Users can view all workouts"
        ON workouts FOR SELECT
        USING (true);
END $$;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_workout_presets_updated_at ON workout_presets;
DROP TRIGGER IF EXISTS update_workouts_updated_at ON workouts;
DROP TRIGGER IF EXISTS update_exercises_updated_at ON exercises;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_workout_templates_updated_at ON workout_templates;

-- Create triggers
CREATE TRIGGER update_workout_presets_updated_at
    BEFORE UPDATE ON workout_presets
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
    BEFORE UPDATE ON workouts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON exercises
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at
    BEFORE UPDATE ON workout_templates
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Insert workout presets
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Set a default user ID for initial setup
    v_user_id := '00000000-0000-0000-0000-000000000000';

    INSERT INTO workout_presets (name, description, type, user_id, exercises)
    VALUES 
        (
            'Monday: Bouldering + Mobility & Core',
            'Climbing session followed by mobility work',
            'other',
            v_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Bouldering Session' LIMIT 1),
                    'sets', 1,
                    'duration', 7200
                ),
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Core Circuit' LIMIT 1),
                    'sets', 3,
                    'duration', 45
                ),
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Dynamic Stretching' LIMIT 1),
                    'sets', 1,
                    'duration', 900
                )
            )
        ),
        (
            'Tuesday: Full Body Strength (Push Focus)',
            'Strength training focusing on pushing movements',
            'strength',
            v_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Push-ups' LIMIT 1),
                    'sets', 4,
                    'reps', 12
                ),
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Core Circuit' LIMIT 1),
                    'sets', 3,
                    'duration', 45
                )
            )
        ),
        (
            'Wednesday: Zone 2 Cardio + Mobility',
            'Low intensity cardio and mobility work',
            'cardio',
            v_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Zone 2 Cardio' LIMIT 1),
                    'duration', 2700,
                    'distance', 5000
                ),
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Dynamic Stretching' LIMIT 1),
                    'duration', 900
                )
            )
        ),
        (
            'Thursday: Soccer',
            'Team sports and cardio',
            'other',
            v_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Soccer' LIMIT 1),
                    'duration', 5400
                ),
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Dynamic Stretching' LIMIT 1),
                    'duration', 600
                )
            )
        ),
        (
            'Friday: Full Body Strength (Pull Focus)',
            'Strength training focusing on pulling movements',
            'strength',
            v_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Pull-ups' LIMIT 1),
                    'sets', 4,
                    'reps', 8
                ),
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Core Circuit' LIMIT 1),
                    'sets', 3,
                    'duration', 45
                )
            )
        ),
        (
            'Saturday: Bouldering',
            'Climbing session',
            'other',
            v_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Bouldering Session' LIMIT 1),
                    'duration', 7200
                )
            )
        ),
        (
            'Saturday: Long Cardio',
            'Extended cardio session (run, cycle, etc)',
            'cardio',
            v_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Zone 2 Cardio' LIMIT 1),
                    'duration', 4500,
                    'distance', 10000
                )
            )
        ),
        (
            'Sunday: Active Recovery + Mobility',
            'Light movement and mobility work',
            'mobility',
            v_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Dynamic Stretching' LIMIT 1),
                    'duration', 1800
                ),
                jsonb_build_object(
                    'exercise_id', (SELECT id FROM exercises WHERE name = 'Core Circuit' LIMIT 1),
                    'sets', 2,
                    'duration', 30
                )
            )
        );
END $$;

-- Create sample workouts for the current week
DO $$
DECLARE
    monday_date DATE;
BEGIN
    monday_date := date_trunc('week', current_date)::date;
    
    INSERT INTO workouts (user_id, date, title, type, completed, note, exercises)
    SELECT
        auth.uid(),
        monday_date + (generate_series(0,6)),
        preset.name,
        preset.type,
        false,
        'Weekly planned workout',
        preset.exercises
    FROM (
        SELECT 
            name,
            type,
            exercises,
            CASE 
                WHEN name LIKE 'Monday%' THEN 0
                WHEN name LIKE 'Tuesday%' THEN 1
                WHEN name LIKE 'Wednesday%' THEN 2
                WHEN name LIKE 'Thursday%' THEN 3
                WHEN name LIKE 'Friday%' THEN 4
                WHEN name LIKE 'Saturday: Bouldering' THEN 5
                WHEN name LIKE 'Sunday%' THEN 6
            END as day_offset
        FROM workout_presets
        WHERE name NOT LIKE 'Saturday: Long Cardio'
    ) preset
    WHERE preset.day_offset IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM workouts w
        WHERE w.date >= monday_date
        AND w.date < monday_date + 7
    );
END $$; 