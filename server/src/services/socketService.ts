import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeSocket = (io: Server) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      if (!process.env.JWT_SECRET) {
        return next(new Error('JWT_SECRET not configured'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
        email: string;
        name: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const user = socket.data.user;
    console.log(`User ${user.name} connected: ${socket.id}`);

    // Store user session
    await prisma.userSession.upsert({
      where: { socketId: socket.id },
      update: { isActive: true, updatedAt: new Date() },
      create: {
        socketId: socket.id,
        userId: user.id,
        isActive: true
      }
    });

    // Join user to their personal room
    socket.join(`user:${user.id}`);

    // Handle joining learning path rooms for collaboration
    socket.on('join-path', async (pathId: string) => {
      try {
        // Check if user has access to this path
        const access = await prisma.learningPath.findFirst({
          where: {
            id: pathId,
            OR: [
              { ownerId: user.id },
              { isPublic: true },
              {
                collaborations: {
                  some: {
                    userId: user.id
                  }
                }
              }
            ]
          }
        });

        if (access) {
          socket.join(`path:${pathId}`);
          socket.emit('path-joined', { pathId });
          
          // Notify other users in the path
          socket.to(`path:${pathId}`).emit('user-joined-path', {
            user: { id: user.id, name: user.name },
            pathId
          });
        } else {
          socket.emit('error', { message: 'Access denied to this learning path' });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to join path' });
      }
    });

    // Handle leaving learning path rooms
    socket.on('leave-path', (pathId: string) => {
      socket.leave(`path:${pathId}`);
      socket.to(`path:${pathId}`).emit('user-left-path', {
        user: { id: user.id, name: user.name },
        pathId
      });
    });

    // Handle real-time node updates
    socket.on('node-update', async (data: {
      pathId: string;
      nodeId: string;
      updates: any;
    }) => {
      try {
        // Verify user has edit access
        const hasAccess = await verifyEditAccess(user.id, data.pathId);
        
        if (hasAccess) {
          // Broadcast to other users in the path
          socket.to(`path:${data.pathId}`).emit('node-updated', {
            nodeId: data.nodeId,
            updates: data.updates,
            updatedBy: { id: user.id, name: user.name },
            timestamp: new Date()
          });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to update node' });
      }
    });

    // Handle real-time cursor/selection sharing
    socket.on('cursor-update', (data: {
      pathId: string;
      nodeId?: string;
      position: { x: number; y: number };
    }) => {
      socket.to(`path:${data.pathId}`).emit('cursor-moved', {
        userId: user.id,
        userName: user.name,
        nodeId: data.nodeId,
        position: data.position
      });
    });

    // Handle real-time translation requests
    socket.on('translate-content', async (data: {
      pathId: string;
      nodeId?: string;
      text: string;
      targetLang: string;
      context: string;
    }) => {
      try {
        // Import translation service dynamically to avoid circular dependency
        const { translateText } = await import('./translationService');
        
        const translation = await translateText(
          data.text,
          data.targetLang,
          user.id,
          data.pathId,
          data.nodeId
        );

        socket.emit('translation-result', {
          originalText: data.text,
          translatedText: translation.translatedText,
          sourceLang: translation.sourceLang,
          targetLang: translation.targetLang,
          context: data.context
        });
      } catch (error) {
        socket.emit('error', { message: 'Translation failed' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User ${user.name} disconnected: ${socket.id}`);
      
      // Update user session
      await prisma.userSession.updateMany({
        where: { socketId: socket.id },
        data: { isActive: false }
      });

      // Notify all connected paths that user left
      const userRooms = Array.from(socket.rooms).filter(room => 
        room.startsWith('path:')
      );
      
      userRooms.forEach(room => {
        socket.to(room).emit('user-disconnected', {
          user: { id: user.id, name: user.name }
        });
      });
    });
  });
};

// Helper function to verify edit access
async function verifyEditAccess(userId: string, pathId: string): Promise<boolean> {
  const access = await prisma.learningPath.findFirst({
    where: {
      id: pathId,
      OR: [
        { ownerId: userId },
        {
          collaborations: {
            some: {
              userId: userId,
              role: { in: ['EDITOR', 'ADMIN'] }
            }
          }
        }
      ]
    }
  });

  return !!access;
} 