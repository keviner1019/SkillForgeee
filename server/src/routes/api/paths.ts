import { Router } from 'express';
import { getAllPath, createNewPath, updatePath, deletePath, getPathById } from '../../controller/learningPath';
import { authenticateToken } from '../../middleware/auth';
import { validateCreateLearningPath, validateUpdateLearningPath } from '../../middleware/validation';

const router = Router();

// GET /api/paths - Get all learning paths for the authenticated user
router.get("/", authenticateToken, getAllPath);

// POST /api/paths - Create a new learning path
router.post("/", authenticateToken, validateCreateLearningPath, createNewPath);

// GET /api/paths/:id - Get a specific learning path by ID
router.get('/:id', authenticateToken, getPathById);

// PUT /api/paths/:id - Update a specific learning path
router.put("/:id", authenticateToken, validateUpdateLearningPath, updatePath);

// DELETE /api/paths/:id - Delete a specific learning path
router.delete("/:id", authenticateToken, deletePath);

// POST /api/paths/generate - AI generate learning path using Gemini

// GET /api/paths/public - Get all public learning paths (for discovery)


export default router; 