import api from "./api";

interface IPost {
  content: string;
}

export interface Like {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  userId: string;
  postId: string;
}
export interface Post {
  id: string;
  content: string;
  createdAt: string;
  likes?: Like[];
  user?: { name: string };
  userId: string;
}

export const PostService = {
  async create(data: IPost): Promise<IPost> {
    const response = await api.post<any>("/posts", data);
    return response.data;
  },
  async findAll(): Promise<any> {
    const response = await api.get<any>("/posts");
    return response.data;
  },

  async findAllByUserId(userId: string): Promise<any> {
    const response = await api.get<any>(`/posts/user/${userId}/`);
    return response.data;
  },
  async delete(id: string): Promise<any> {
    await api.delete<any>(`/posts/${id}`);
  },
  async update(id: string, data: { content: string }): Promise<any> {
    await api.patch<any>(`/posts/${id}`, data);
  },
  async like(id: string): Promise<any> {
    await api.post<any>(`/posts/${id}/like`);
  },
  async unlike(id: string): Promise<any> {
    await api.delete<any>(`/posts/${id}/like`);
  },
};

export default PostService;
