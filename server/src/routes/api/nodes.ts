import { Router } from 'express';
import { createNode,updateNode,deleteNode } from '../../controller/nodes';
import { authenticateToken } from '../../middleware/auth';
import { validateCreateNode , validateUpdateNode} from '../../middleware/validation';
const  router = Router();

//create node
router.post("/:learningPathId", authenticateToken, validateCreateNode, createNode);
//update node
router.put("/:id/:learningPathId", authenticateToken, validateUpdateNode, updateNode);
//delete node
router.delete("/:id/:learningPathId", authenticateToken, deleteNode);

// router.get("/", authenticateToken, validateCreateNode, createNode);


export default router;