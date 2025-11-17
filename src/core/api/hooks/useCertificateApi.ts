// src/core/api/hooks/useCertificateApi.ts
import { useState } from "react";
import { api } from "../axios";

export const useCertificateApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const getMyCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/certificates/my");
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching certificates:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const issueCertificate = async (courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/certificates/issue/${courseId}`);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error issuing certificate:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificateId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/certificates/${certificateId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error downloading certificate:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCertificateById = async (certificateId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/certificates/${certificateId}`);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching certificate:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getMyCertificates,
    issueCertificate,
    downloadCertificate,
    getCertificateById,
    loading,
    error,
  };
};