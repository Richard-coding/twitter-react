import api from "./api";

interface Iuser {
  id: string;
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
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  isFollowing: false;
}

export const UserService = {
  async getProfile(id: string): Promise<any> {
    const response = await api.get<any>(`/users/${id}/profile`);
    return response.data;
  },
};

export default UserService;
