// src/core/hooks/useStudents.ts
import { api } from "../axios";

export const useStudent = () => {
  const getStudents = async ({
    page = 0,
    size = 10,
    sort = "createdAt,desc",
  } = {}) => {
    try {
      const response = await api.get(`/students/summary`, {
        params: { page, size, sort },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  };

  const getStudentById = async (id: number) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error);
      throw error;
    }
  };

  return {
    getStudents,
    getStudentById,
  };
};