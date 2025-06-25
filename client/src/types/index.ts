// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Learning Path types
export interface LearningPath {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: User;
  nodes: PathNode[];
  collaborations?: Collaboration[];
}

// Path Node types
export interface PathNode {
  id: string;
  title: string;
  description?: string;
  status: NodeStatus;
  color: string;
  order: number;
  parentId?: string;
  deadline?: string;
  estimatedTime?: number;
  createdAt: string;
  updatedAt: string;
  pathId: string;
  children?: PathNode[];
  notes?: Note[];
}

export enum NodeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED'
}

// Note types
export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  nodeId: string;
  user: User;
}

// Collaboration types
export interface Collaboration {
  id: string;
  role: CollaborationRole;
  createdAt: string;
  updatedAt: string;
  userId: string;
  pathId: string;
  user: User;
}

export enum CollaborationRole {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}

// Translation types
export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  context: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  pathId?: string;
  nodeId?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 