import { Router } from 'express';
// Routes will be implemented during development
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

// Future AI-powered endpoints (commented for now)
// POST /api/paths/generate - AI generate learning path using Gemini
// router.post('/generate', authenticateToken, async (req, res) => {
//   res.status(501).json({ 
//     message: 'AI generate path endpoint - to be implemented (using Google Gemini API)',
//     note: 'This will use the Gemini service for AI-powered learning path generation'
//   });
// });

// POST /api/paths/:id/duplicate - Duplicate an existing learning path
// router.post('/:id/duplicate', authenticateToken, async (req, res) => {
//   res.status(501).json({ 
//     message: 'Duplicate path endpoint - to be implemented'
//   });
// });

// GET /api/paths/public - Get all public learning paths (for discovery)
// router.get('/public', async (req, res) => {
//   res.status(501).json({ 
//     message: 'Public paths discovery endpoint - to be implemented'
//   });
// });

export default router; 