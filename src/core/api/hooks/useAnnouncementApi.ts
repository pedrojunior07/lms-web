// src/core/api/hooks/useAnnouncementApi.ts
import { api } from "../axios";

export const useAnnouncementApi = () => {
  const listAnnouncements = async () => {
    const res = await api.get("/announcements");
    return res.data;
  };

  const createAnnouncement = async (payload: {
    title: string;
    message: string;
    courseId: number;
    status?: string;
  }) => {
    const res = await api.post("/announcements", payload);
    return res.data;
  };

  const updateAnnouncement = async (id: string, payload: {
    title: string;
    message: string;
    courseId: number;
    status?: string;
  }) => {
    const res = await api.put(`/announcements/${id}`, payload);
    return res.data;
  };

  const deleteAnnouncement = async (id: string) => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  };

  return { listAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
};
