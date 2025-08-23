import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  GetCurrentUserResponse,
} from "../types/auth";
import { getData, postData } from "./api-client";

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return postData<LoginResponse>("/auth/login", data);
  },

  logout: (): Promise<LogoutResponse> => {
    return postData<LogoutResponse>("/auth/logout");
  },

  getCurrentUser: (): Promise<GetCurrentUserResponse> => {
    return getData<GetCurrentUserResponse>("/auth/me");
  },
};
