import { Request, Response, NextFunction } from "express";
import {
  updateNodeRequest,
  deleteNodeRequest,
  createNodeRequest,
} from "../types/nodes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createNode = async (
  req: createNodeRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const learningPathId = parseInt(req.params.learningPathId);
    const userId = req.user?.id;
    const { title, description } = req.body;

    // Validate learningPathId
    if (!learningPathId || isNaN(learningPathId)) {
      res.status(400).json({
        success: false,
        message: "Valid Learning Path ID is required.",
      });
      return;
    }

    // Validate user authentication
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Validate required fields (though validation middleware should handle this)
    if (!title || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Title is required and cannot be empty",
      });
      return;
    }

    // Check if learning path exists and user has access
    const learningPath = await prisma.learningPath.findFirst({
      where: {
        id: learningPathId,
        ownerId: userId, // Ensure user owns the learning path
      },
    });

    if (!learningPath) {
      res.status(404).json({
        success: false,
        message: "Learning path not found or access denied",
      });
      return;
    }

    const node = await prisma.node.create({
      data: {
        title: title.trim(),
        description: description?.trim() || "",
        learningPathId: learningPathId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Node created successfully",
      data: node,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNode = async (
  req: updateNodeRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const nodeId = parseInt(req.params.id);
    const learningPathId = parseInt(req.params.learningPathId);
    const userId = req.user?.id;

    // Validate IDs
    if (!nodeId || isNaN(nodeId) || !learningPathId || isNaN(learningPathId)) {
      res.status(400).json({
        success: false,
        message: "Valid Node ID and Learning Path ID are required.",
      });
      return;
    }

    // Validate user authentication
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Check if node exists and user has permission
    const nodeExists = await prisma.node.findFirst({
      where: {
        id: nodeId,
        learningPathId: learningPathId,
        learningPath: {
          ownerId: userId,
        },
      },
      include: {
        learningPath: true,
      },
    });

    if (!nodeExists) {
      res.status(404).json({
        success: false,
        message: "Node not found or you don't have permission to update it",
      });
      return;
    }

    const {
      title,
      description,
      status,
      notificationDate,
      color,
      positionX,
      positionY,
      parentNodeId,
    } = req.body;

    // Build update data object with proper validation
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    if (notificationDate !== undefined) updateData.notificationDate = new Date(notificationDate);
    if (color !== undefined) updateData.color = color.trim();
    if (positionX !== undefined) updateData.positionX = positionX;
    if (positionY !== undefined) updateData.positionY = positionY;
    if (parentNodeId !== undefined) updateData.parentNodeId = parentNodeId;

    // Validate parentNodeId if provided
    if (parentNodeId) {
      const parentNode = await prisma.node.findFirst({
        where: {
          id: parentNodeId,
          learningPathId: learningPathId,
        },
      });

      if (!parentNode) {
        res.status(400).json({
          success: false,
          message: "Parent node not found in the same learning path",
        });
        return;
      }
    }

    const updatedNode = await prisma.node.update({
      where: {
        id: nodeId,
      },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Node updated successfully",
      data: updatedNode,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNode = async (
  req: deleteNodeRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const nodeId = parseInt(req.params.id);
    const learningPathId = parseInt(req.params.learningPathId);
    const userId = req.user?.id;

    // Validate IDs
    if (!nodeId || isNaN(nodeId) || !learningPathId || isNaN(learningPathId)) {
      res.status(400).json({
        success: false,
        message: "Valid Node ID and Learning Path ID are required.",
      });
      return;
    }

    // Validate user authentication
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const nodeExists = await prisma.node.findFirst({
      where: {
        id: nodeId,
        learningPathId: learningPathId,
        learningPath: {
          ownerId: userId,
        },
      },
      include: {
        learningPath: true,
      },
    });

    if (!nodeExists) {
      res.status(404).json({
        success: false,
        message: "Node not found or you don't have permission to delete it",
      });
      return;
    }

    await prisma.node.delete({
      where: {
        id: nodeId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Node deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// export const deleteNode = async (
//   req: deleteNodeRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const nodeId = parseInt(req.params.id);
//   const learningPathId = parseInt(req.params.id);
//   if (!learningPathId || nodeId) {
//     res.status(400).json({
//       success: false,
//       message: "Node or Learning Path ID is required.",
//     });
//   }

//   const nodeExist = await prisma.node.findFirst({
//     where: {
//       id: nodeId,
//       learningPathId: learningPathId,
//     },
//   });

//   if (!nodeExist) {
//     res.status(404).json({
//       success: false,
//       message: "Node not found or you don't have permission to delete it",
//     });
//   }
//   try {
//     const nodes = await prisma.node.delete({
//       where: {
//         id: nodeId,
//         learningPathId: learningPathId,
//       },
//     });
//     res.status(201).json({
//       success: true,
//       message: "Node deleted",
//       nodes,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
