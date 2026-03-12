import api from "./api";

interface IPost {
  content: string;
}

export const PostService = {
  async create(data: IPost): Promise<any> {
    const response = await api.post<any>("/posts", data);
    return response.data;
  },
  async findAll(): Promise<any> {
    const response = await api.get<any>("/posts");
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
