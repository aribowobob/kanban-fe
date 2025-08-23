// Task related types
export type TaskStatus = "TO_DO" | "DOING" | "DONE";
export type TeamType = "DESIGN" | "BACKEND" | "FRONTEND";

export interface TaskAttachment {
  name: string;
  url: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  teams: TeamType[];
  external_link?: string;
  attachments: TaskAttachment[];
  created_at: string;
  updated_at: string;
  created_by: number;
}

export interface CreateTaskRequest {
  name: string;
  description?: string;
  status: TaskStatus;
  teams: TeamType[];
  external_link?: string;
}

export interface UpdateTaskRequest {
  name: string;
  description?: string;
  status: TaskStatus;
  teams: TeamType[];
  external_link?: string;
}

// API Response types
export interface GetTasksResponse {
  status: string;
  message: string;
  data: Task[];
}

export interface GetTaskResponse {
  status: string;
  message: string;
  data: Task;
}

export interface CreateTaskResponse {
  status: string;
  message: string;
  data: Task;
}

export interface UpdateTaskResponse {
  status: string;
  message: string;
  data: Task;
}

export interface DeleteTaskResponse {
  status: string;
  message: string;
  data: boolean;
}
