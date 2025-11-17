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
  }) => {
    const res = await api.post("/announcements", payload);
    return res.data;
  };

  return { listAnnouncements, createAnnouncement };
};
