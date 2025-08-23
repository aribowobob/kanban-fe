import { APIResponse } from "./common";

export interface User {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LogoutResponse {
  status: string;
  message: string;
  data: boolean;
}

export type GetCurrentUserResponse = APIResponse<User>;
