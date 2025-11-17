// src/core/api/hooks/useCourseApi.ts
import { useState } from "react";
import { api } from "../axios";

export const useCourseApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // Funções existentes mantidas
  const saveBasicInfo = async (courseData: any) => {
    const response = await api.post("/courses/step1/basic-info", courseData);
    return response.data;
  };

  const savePayment = async (courseData: any) => {
    const id = localStorage.getItem("id");
    const response = await api.post(`/purchases/course/${id}`, courseData);
    return response.data;
  };

  const validate = async (paymentId: any) => {
    const response = await api.post(`/purchases/valide/${paymentId}`);
    return response.data;
  };

  const saveQuizz = async (quiz: any) => {
    try {
      const response = await api.post(`/quizzes`, quiz);
      alert("Quiz saved successfully!");
      return response.data;
    } catch (error) {
      console.error("Error saving quiz:", error);
      throw error;
    }
  };

  const listInstructorCourses = async (filters: any) => {
    const response = await api.get("/courses/instructor-courses", {
      params: {
        title: filters.title,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        status: filters.status,
        instructorId: filters.instructorId,
        page: filters.page ?? 0,
        size: filters.size ?? 20,
        sort: filters.sort ?? "title,asc",
      },
    });
    return response.data;
  };

  const listPayments = async () => {
    const response = await api.get("/purchases");
    return response.data;
  };

  const getCourseCards = async (courseId: any) => {
    const response = await api.get(`/courses/mudules-course/${courseId}`, {});
    return response.data;
  };

  const saveMedia = async (courseId: any, mediaData: any) => {
    const response = await api.put(
      `/courses/${courseId}/step-2/media`,
      mediaData
    );
    return response.data;
  };

  const getCourseStats = async () => {
    const response = await api.get("/courses/stats");
    console.log("Fetched course stats:", response.data);
    return response.data;
  };

  const getCourceById = async (courseId: Number) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  };

  const getCategories = async () => {
    const response = await api.get("/categories");
    return response.data.data;
  };

  const saveCurriculum = async (courseId: any, curriculumData: any) => {
    const response = await api.put(
      `/courses/${courseId}/step-3/curriculum`,
      curriculumData
    );
    return response.data;
  };

  const savePricing = async (courseId: any, pricingData: any) => {
    const response = await api.put(
      `/courses/${courseId}/step-4/pricing`,
      pricingData
    );
    return response.data;
  };

  const getgetStats = async () => {
    const response = await api.get("/courses/stats");
    return response.data;
  };

  const getTop10Cources = async () => {
    const response = await api.get("/courses/top-10-cources");
    return response.data;
  };

  const getTopCategories = async () => {
    const response = await api.get("/courses/top-categories");
    return response.data.data;
  };

  const getSearchCourse = async (filters: any) => {
    const response = await api.get("/courses/search", {
      params: {
        page: filters.page ?? 0,
        size: filters.size ?? 10,
        sort: filters.sort ?? "title,asc",
      },
    });
    return response.data;
  };

  const getCategoriesWithNumbers = async () => {
    const response = await api.get("/categories/categories-with-numbers");
    return response.data;
  };

  const getCourcesStudents = async (filters: any, id: any) => {
    const response = await api.get(`/courses/students-cources/${id}`, {
      params: {
        page: filters.page ?? 0,
        size: filters.size ?? 10,
        sort: filters.sort ?? "title,asc",
      },
    });
    return response.data;
  };

  const saveQuiz = async (quizData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/quizzes", quizData);
      console.log("Quiz saved successfully:", response.data);
      return response.data;
    } catch (err) {
      setError(err);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listQuizzes = async (filters = { page: 0, size: 10 }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/quizzes", {
        params: filters,
      });
      return response.data;
    } catch (err) {
      setError(err);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getQuizById = async (quizId: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      return response.data;
    } catch (err) {
      setError(err);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (quizId: any, updatedData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/quizzes/${quizId}`, updatedData);
      return response.data;
    } catch (err) {
      setError(err);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/quizzes/${quizId}`);
      return response.status === 204;
    } catch (err) {
      setError(err);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCourseAll = async () => {
    try {
      const response = await api.get(`/courses/all-courses`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all courses:", error);
      throw error;
    }
  };

  // NOVAS FUNÇÕES ADICIONADAS PARA STUDENT DASHBOARD
  const getMyLikedCourses = async (filters: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/courses/my-liked-courses", {
        params: {
          page: filters.page ?? 0,
          size: filters.size ?? 10,
          sort: filters.sort ?? "createdAt,desc",
        },
      });
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching liked courses:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseLike = async (courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/courses/${courseId}/like`);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error toggling course like:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCourseProgress = async (courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/courses/${courseId}/progress`);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching course progress:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async (courseId: number, lessonId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error completing lesson:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDetailedProgress = async (courseId: number, studentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/courses-progress/${courseId}/students/${studentId}/modules-with-progress`);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching detailed progress:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStudentDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/students/dashboard/stats");
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching dashboard stats:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStudentRecentInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/students/invoices/recent");
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching recent invoices:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStudentQuizProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/students/quizzes/progress");
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching quiz progress:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Funções existentes
    saveBasicInfo,
    saveMedia,
    getTop10Cources,
    getTopCategories,
    getCourceById,
    listInstructorCourses,
    saveCurriculum,
    savePricing,
    getCourseCards,
    getCategories,
    getgetStats,
    getSearchCourse,
    savePayment,
    getCourcesStudents,
    getCourseStats,
    getCategoriesWithNumbers,
    saveQuiz,
    listQuizzes,
    getQuizById,
    updateQuiz,
    saveQuizz,
    getCourseAll,
    deleteQuiz,
    validate,
    listPayments,

    // Novas funções para student dashboard
    getMyLikedCourses,
    toggleCourseLike,
    getCourseProgress,
    completeLesson,
    getDetailedProgress,
    getStudentDashboardStats,
    getStudentRecentInvoices,
    getStudentQuizProgress,

    // Estados
    loading,
    error,
  };
};