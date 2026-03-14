import api from "./api";

interface Icomment {
  content: string;
}

export const CommentService = {
  async findAllByPostId(id: string): Promise<any> {
    const response = await api.get<any>(`/posts/${id}/comments`);
    return response.data;
  },
  async create(id: string, data: { content: string }): Promise<any> {
    const response = await api.post<any>(`/posts/${id}/comments`, data);
    return response.data;
  },
  async delete(id: string, commentId: string): Promise<any> {
    await api.delete<any>(`/posts/${id}/comments/${commentId}`);
  },
  async like(id: string, commentId: string): Promise<any> {
    await api.post<any>(`/posts/${id}/comments/${commentId}/like`);
  },
  async unlike(id: string, commentId: string): Promise<any> {
    await api.delete<any>(`/posts/${id}/comments/${commentId}/like`);
  },
};

export default CommentService;
