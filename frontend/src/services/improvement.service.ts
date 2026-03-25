import api from "./api";

interface ICreateImprovement {
  title: string;
  description?: string;
  type: any;
}

export const ImprovementService = {
  async findAll(): Promise<any> {
    const response = await api.get<any>(`/improvements`);
    return response.data;
  },
  async create(data: ICreateImprovement): Promise<any> {
    const response = await api.post<any>("/improvements", data);
    return response.data;
  },
};

export default ImprovementService;
