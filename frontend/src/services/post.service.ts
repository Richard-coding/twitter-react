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
};

export default PostService;
