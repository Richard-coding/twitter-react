import api from "./api";
import type { IUserProfile } from "./user.service";

export interface IFollow {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  followerId: string;
  followingId: string;
  follower: IUserProfile;
}

export const FollowService = {
  async follow(userProfile: string): Promise<void> {
    await api.post(`/users/${userProfile}/follow`);
  },
  async unfollow(userProfile: string): Promise<void> {
    await api.delete(`/users/${userProfile}/follow`);
  },
  async getFollowers(userProfile: string): Promise<IFollow[]> {
    const response = await api.get(`/users/${userProfile}/followers`);
    return response.data;
  },
  async getFollowing(userProfile: string): Promise<IFollow[]> {
    const response = await api.get(`/users/${userProfile}/following`);
    return response.data;
  },
};
