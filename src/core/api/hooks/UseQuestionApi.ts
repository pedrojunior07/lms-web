
// src/core/api/hooks//UseQuestionApi.ts
"use client";

import { useState } from "react";
import { api } from "../axios";

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctOption: number;
  quizId: number;
}

interface CreateQuestionData {
  quizId: number;
  questionText: string;
  options: string[];
  correctOption: number;
}

interface UpdateQuestionData {
  questionText: string;
  options: string[];
  correctOption: number;
}

export const useQuestionApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuestionsByQuiz = async (
    quizId: string | number
  ): Promise<Question[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/questions/quiz/${quizId}`);
      console.log(response);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch questions";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: CreateQuestionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/questions", questionData);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create question";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (
    questionId: number,
    questionData: UpdateQuestionData
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/questions/${questionId}`, questionData);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update question";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.delete(`/questions/${questionId}`);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete question";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // API methods
    getQuestionsByQuiz,
    createQuestion,
    updateQuestion,
    deleteQuestion,

    // State
    loading,
    error,

    // Utilities
    clearError,
  };
};
