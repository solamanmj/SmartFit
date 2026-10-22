import express from 'express';
import Exercise from '../models/Exercise.js';
import { WORKOUT_SPLITS_LIST, INITIAL_EXERCISES_DATABASE } from '../data/exerciseSeedData.js';

const router = express.Router();

// Auto-seed or ensure default database is populated
async function ensureExercisesSeeded() {
  try {
    const count = await Exercise.countDocuments();
    if (count === 0) {
      console.log('[INFO] Seeding initial Virtual Workout Exercise database...');
      await Exercise.insertMany(INITIAL_EXERCISES_DATABASE);
      console.log(`[SUCCESS] Seeded ${INITIAL_EXERCISES_DATABASE.length} comprehensive exercises into MongoDB.`);
    }
  } catch (err) {
    console.warn('[WARN] Exercise auto-seed notice:', err.message);
  }
}
ensureExercisesSeeded();

// GET /api/exercises/splits - List all 14 workout splits
router.get('/splits', async (req, res) => {
  try {
    let exercises = [];
    try {
      exercises = await Exercise.find({});
    } catch (e) {
      exercises = INITIAL_EXERCISES_DATABASE;
    }

    // Calculate actual counts per split
    const splitsWithCounts = WORKOUT_SPLITS_LIST.map(split => {
      const actualCount = exercises.filter(e => e.splitId?.toLowerCase() === split.id.toLowerCase()).length;
      return {
        ...split,
        count: actualCount > 0 ? actualCount : split.count
      };
    });

    res.json({
      success: true,
      splits: splitsWithCounts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout splits', message: err.message });
  }
});

// GET /api/exercises - Query exercises by split, category, or search term
router.get('/', async (req, res) => {
  try {
    const { splitId, category, search, difficulty } = req.query;
    let query = {};

    if (splitId && splitId !== 'all') {
      query.splitId = splitId.toLowerCase();
    }
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    if (difficulty) {
      query.difficulty = new RegExp(difficulty, 'i');
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { primaryMuscles: new RegExp(search, 'i') },
        { secondaryMuscles: new RegExp(search, 'i') },
        { movementType: new RegExp(search, 'i') }
      ];
    }

    let exercises = [];
    try {
      exercises = await Exercise.find(query).sort({ name: 1 });
    } catch (e) {
      exercises = INITIAL_EXERCISES_DATABASE.filter(ex => {
        if (splitId && splitId !== 'all' && ex.splitId?.toLowerCase() !== splitId.toLowerCase()) return false;
        if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
    }

    // Fallback to in-memory seeds if DB was empty or offline
    if (!exercises || exercises.length === 0) {
      if (splitId && splitId !== 'all') {
        exercises = INITIAL_EXERCISES_DATABASE.filter(e => e.splitId.toLowerCase() === splitId.toLowerCase());
      } else {
        exercises = INITIAL_EXERCISES_DATABASE;
      }
    }

    res.json({
      success: true,
      count: exercises.length,
      exercises
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercises', message: err.message });
  }
});

// GET /api/exercises/:id - Get single exercise by ID or name
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let exercise = null;

    try {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        exercise = await Exercise.findById(id);
      } else {
        exercise = await Exercise.findOne({ name: new RegExp(`^${id}$`, 'i') });
      }
    } catch (e) {
      exercise = null;
    }

    if (!exercise) {
      exercise = INITIAL_EXERCISES_DATABASE.find(e => 
        e.id === id || e.name.toLowerCase() === decodeURIComponent(id).toLowerCase()
      );
    }

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({
      success: true,
      exercise
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercise', message: err.message });
  }
});

// POST /api/exercises - Create new exercise (Admin/Trainer)
router.post('/', async (req, res) => {
  try {
    const newEx = new Exercise(req.body);
    await newEx.save();
    res.status(201).json({
      success: true,
      message: 'Exercise created successfully',
      exercise: newEx
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create exercise', message: err.message });
  }
});

// PUT /api/exercises/:id - Update exercise (Admin/Trainer)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Exercise not found to update' });
    }
    res.json({
      success: true,
      message: 'Exercise updated successfully',
      exercise: updated
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update exercise', message: err.message });
  }
});

// DELETE /api/exercises/:id - Delete exercise (Admin/Trainer)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Exercise not found to delete' });
    }
    res.json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete exercise', message: err.message });
  }
});

// POST /api/exercises/seed - Force re-seed default exercises
router.post('/seed', async (req, res) => {
  try {
    await Exercise.deleteMany({});
    await Exercise.insertMany(INITIAL_EXERCISES_DATABASE);
    res.json({
      success: true,
      message: `Database successfully re-seeded with ${INITIAL_EXERCISES_DATABASE.length} exercises.`
    });
  } catch (err) {
    res.status(500).json({ error: 'Re-seed failed', message: err.message });
  }
});

export default router;
