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
  async findAll(): Promise<any> {
    const response = await api.get<IUser>("/users");
    return response.data;
  },
  async getProfile(username: string): Promise<IUserProfile> {
    const response = await api.get<IUserProfile>(`/users/${username}/profile`);
    return response.data;
  },
  async update(id: string, data: { bio: string }) {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },
  async getLikedPosts(username: string) {
    const response = await api.get(`/users/${username}/likes`);
    return response.data;
  },
};

export default UserService;
