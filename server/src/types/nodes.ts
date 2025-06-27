import { Request } from "express";

// Enum for node status matching Prisma schema
export enum NodeStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

// Base interface for node data
export interface NodeBase {
  title: string;
  description?: string;
  status?: NodeStatus;
  notificationDate?: Date | string;
  color?: string;
  positionX?: number;
  positionY?: number;
  parentNodeId?: number;
}

// For creating a node - only title is required
export interface CreateNodeData {
  title: string;
  description?: string;
}

// For updating a node - all fields are optional
export interface UpdateNodeData extends Partial<NodeBase> { }

// Request interface for creating a node
export interface createNodeRequest extends Request {
  body: CreateNodeData;
  params: {
    learningPathId: string;
  };
  user?: {
    id: number;
    username: string;
  };
}

// Request interface for updating a node
export interface updateNodeRequest extends Request {
  body: UpdateNodeData;
  params: {
    id: string;
    learningPathId: string;
  };
  user?: {
    id: number;
    username: string;
  };
}

// Request interface for deleting a node
export interface deleteNodeRequest extends Request {
  params: {
    id: string;
    learningPathId: string;
  };
  user?: {
    id: number;
    username: string;
  };
}

// Request interface for getting nodes
// export interface getNodeRequest extends Request {
//   params?: {
//     id?: string;
//     learningPathId?: string;
//   };
//   user?: {
//     id: number;
//     username: string;
//   };
// }
