import api from "./api";

interface IUserRegister {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface IUserLogin {
  email: string;
  password: string;
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Partial<IUserRegister>;
}

export const authService = {
  async register(data: IUserRegister): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async login(data: IUserLogin): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },
  async getMe(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};

export default authService;
