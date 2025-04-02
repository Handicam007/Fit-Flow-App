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
    'Squats',
    'Body weight or weighted squats',
    c.id,
    3,
    12
FROM categories c
WHERE c.name = 'Strength'
UNION ALL
SELECT 
    'Dumbbell Bench Press',
    'Bench press with dumbbells',
    c.id,
    3,
    10
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
    'Trap Bar Deadlift',
    'Deadlift using trap/hex bar',
    c.id,
    4,
    6
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
    'Interval Running',
    '30 sec sprint, 90 sec jog',
    c.id,
    6,
    1
FROM categories c
WHERE c.name = 'Cardio'
UNION ALL
SELECT 
    'Hill Sprints',
    'Short, intense uphill sprints',
    c.id,
    8,
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
    'Yoga Flow',
    'Flowing yoga sequence',
    c.id,
    1,
    1
FROM categories c
WHERE c.name = 'Mobility'
UNION ALL
SELECT 
    'Hip Mobility',
    'Focus on hip mobility exercises',
    c.id,
    3,
    10
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

-- Clear existing workout templates
TRUNCATE TABLE workout_templates;

-- Insert Strength Templates
INSERT INTO workout_templates (name, description, type, category, exercises)
VALUES 
    (
        'Full Body Strength',
        'Complete full body strength workout',
        'strength',
        'Strength',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Squats' LIMIT 1),
                'sets', 3,
                'reps', 12
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Push-ups' LIMIT 1),
                'sets', 3,
                'reps', 15
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Pull-ups' LIMIT 1),
                'sets', 3,
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
        'Upper Body Push',
        'Focus on pushing movements',
        'strength',
        'Strength',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Push-ups' LIMIT 1),
                'sets', 4,
                'reps', 12
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Dumbbell Bench Press' LIMIT 1),
                'sets', 3,
                'reps', 10
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Core Circuit' LIMIT 1),
                'sets', 3,
                'duration', 45
            )
        )
    ),
    (
        'Lower Body Strength',
        'Focus on leg exercises',
        'strength',
        'Strength',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Squats' LIMIT 1),
                'sets', 4,
                'reps', 12
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Trap Bar Deadlift' LIMIT 1),
                'sets', 4,
                'reps', 6
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Core Circuit' LIMIT 1),
                'sets', 3,
                'duration', 45
            )
        )
    ),
    (
        'Upper Body Pull',
        'Focus on pulling movements',
        'strength',
        'Strength',
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
    );

-- Insert Cardio Templates
INSERT INTO workout_templates (name, description, type, category, exercises)
VALUES 
    (
        'Zone 2 Cardio',
        'Low intensity steady state',
        'cardio',
        'Cardio',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Zone 2 Cardio' LIMIT 1),
                'duration', 2700,
                'distance', 5000
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Dynamic Stretching' LIMIT 1),
                'duration', 600
            )
        )
    ),
    (
        'Interval Training',
        'High intensity interval training',
        'cardio',
        'Cardio',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Interval Running' LIMIT 1),
                'sets', 6,
                'duration', 1800
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Dynamic Stretching' LIMIT 1),
                'duration', 600
            )
        )
    ),
    (
        'Long Cardio',
        'Extended cardio session',
        'cardio',
        'Cardio',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Zone 2 Cardio' LIMIT 1),
                'duration', 4500,
                'distance', 10000
            )
        )
    );

-- Insert Mobility Templates
INSERT INTO workout_templates (name, description, type, category, exercises)
VALUES 
    (
        'Full Body Mobility',
        'Complete mobility routine',
        'mobility',
        'Mobility',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Dynamic Stretching' LIMIT 1),
                'duration', 1200
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Hip Mobility' LIMIT 1),
                'sets', 3,
                'reps', 10
            )
        )
    ),
    (
        'Yoga Flow',
        'Flowing yoga sequence',
        'mobility',
        'Mobility',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Yoga Flow' LIMIT 1),
                'duration', 1800
            )
        )
    ),
    (
        'Active Recovery',
        'Light movement for recovery days',
        'mobility',
        'Mobility',
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

-- Insert Other Templates
INSERT INTO workout_templates (name, description, type, category, exercises)
VALUES 
    (
        'Bouldering Session',
        'Climbing workout',
        'other',
        'Other',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Bouldering Session' LIMIT 1),
                'duration', 7200
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Dynamic Stretching' LIMIT 1),
                'duration', 600
            )
        )
    ),
    (
        'Soccer',
        'Soccer match or training',
        'other',
        'Other',
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
        'Boxing Session',
        'Boxing training',
        'other',
        'Other',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Boxing' LIMIT 1),
                'duration', 3600
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Dynamic Stretching' LIMIT 1),
                'duration', 600
            )
        )
    ),
    (
        'Climbing & Core',
        'Bouldering with core work',
        'other',
        'Other',
        jsonb_build_array(
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Bouldering Session' LIMIT 1),
                'duration', 7200
            ),
            jsonb_build_object(
                'exercise_id', (SELECT id FROM exercises WHERE name = 'Core Circuit' LIMIT 1),
                'sets', 3,
                'duration', 45
            )
        )
    );

-- Insert standard weekly workouts
INSERT INTO workout_presets (name, description, type, exercises)
VALUES 
    (
        'Monday: Bouldering + Mobility & Core',
        'Climbing session followed by mobility work',
        'other',
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