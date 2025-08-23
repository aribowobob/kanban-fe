import {
  GetTasksResponse,
  GetTaskResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
} from "../types/task";
import { getData, postData, putData, deleteData } from "./api-client";

export const taskApi = {
  getTasks: (): Promise<GetTasksResponse> => {
    return getData<GetTasksResponse>("/tasks");
  },

  getTask: (id: number): Promise<GetTaskResponse> => {
    return getData<GetTaskResponse>(`/tasks/${id}`);
  },

  createTask: (data: CreateTaskRequest): Promise<CreateTaskResponse> => {
    return postData<CreateTaskResponse>("/tasks", data);
  },

  updateTask: (
    id: number,
    data: UpdateTaskRequest
  ): Promise<UpdateTaskResponse> => {
    return putData<UpdateTaskResponse>(`/tasks/${id}`, data);
  },

  deleteTask: (id: number): Promise<DeleteTaskResponse> => {
    return deleteData<DeleteTaskResponse>(`/tasks/${id}`);
  },
};
