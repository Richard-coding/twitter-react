import api from "./api";

interface IUserRegister {
  name: string;
  email: string;
  password: string;
}

interface IUserLogin {
  email: string;
  password: string;
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
  async getMe(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>("/auth/me");
    return response.data;
  },
};

export default authService;
