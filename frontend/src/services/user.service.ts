import api from "./api";

export interface IUser {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  name: string;
  email: string;
  bio: null;
  avatarUrl: null;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
}

export interface IUserProfile extends IUser {
  isFollowing: false;

  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}
export const UserService = {
  async getProfile(id: string): Promise<IUserProfile> {
    const response = await api.get<IUserProfile>(`/users/${id}/profile`);
    return response.data;
  },
  async findAll(): Promise<any> {
    const response = await api.get<IUser>("/users");
    return response.data;
  },
};

export default UserService;
