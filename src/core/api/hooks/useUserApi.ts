import { api } from "../axios";

export const usePerson = () => {
  const getUser = async (id: any) => {
    const response = await api.get(`/instructors/${id}`);
    return response.data.data;
  };

  return {
    getUser,
  };
};
