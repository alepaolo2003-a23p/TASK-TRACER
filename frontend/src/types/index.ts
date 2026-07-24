export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categoryColor: string | null;
  createdAt: string;
  updatedAt: string;
  recurring: boolean;
  recurrenceRule: string | null;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  categoryId?: string | null;
  recurring?: boolean;
  recurrenceRule?: string | null;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface CategoryRequest {
  name: string;
  color: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}
