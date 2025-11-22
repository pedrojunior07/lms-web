// src/core/api/hooks/useCourseOrders.ts
import { useState, useCallback } from "react";
import { api, apiMultipart } from "../axios";
import { PaymentWallet, WalletType } from "./usePaymentWallets";

export type OrderStatus = "PENDING" | "PROOF_UPLOADED" | "APPROVED" | "REJECTED";

export interface CourseOrder {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  courseThumbnail: string;
  status: OrderStatus;
  paymentMethod: WalletType;
  amount: number;
  proofOfPaymentUrl?: string;
  orderDate: string;
  validatedDate?: string;
  rejectionReason?: string;
  selectedWallet?: PaymentWallet;
}

export interface CreateOrderRequest {
  courseId: number;
  studentId: number;
  paymentMethod: WalletType;
  walletId: number;
}

export const useCourseOrders = () => {
  const [orders, setOrders] = useState<CourseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student: Create order
  const createOrder = useCallback(async (request: CreateOrderRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/orders", request);
      if (response.data.status === "success") {
        setOrders(prev => [response.data.data, ...prev]);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao criar pedido";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Student: Get my orders
  const fetchStudentOrders = useCallback(async (studentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/orders/student/${studentId}`);
      if (response.data.status === "success") {
        setOrders(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao carregar pedidos";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Student: Upload proof of payment
  const uploadProof = useCallback(async (orderId: number, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiMultipart.post(`/orders/${orderId}/proof`, formData);
      if (response.data.status === "success") {
        setOrders(prev => prev.map(o => o.id === orderId ? response.data.data : o));
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao enviar comprovativo";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Instructor: Get orders for my courses
  const fetchInstructorOrders = useCallback(async (instructorId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/orders/instructor/${instructorId}`);
      if (response.data.status === "success") {
        setOrders(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao carregar pedidos";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Instructor: Approve order
  const approveOrder = useCallback(async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/orders/${orderId}/approve`);
      if (response.data.status === "success") {
        setOrders(prev => prev.map(o => o.id === orderId ? response.data.data : o));
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao aprovar pedido";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Instructor: Reject order
  const rejectOrder = useCallback(async (orderId: number, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/orders/${orderId}/reject`, { reason });
      if (response.data.status === "success") {
        setOrders(prev => prev.map(o => o.id === orderId ? response.data.data : o));
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao rejeitar pedido";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get order by ID
  const getOrderById = useCallback(async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (response.data.status === "success") {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao carregar pedido";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    error,
    createOrder,
    fetchStudentOrders,
    uploadProof,
    fetchInstructorOrders,
    approveOrder,
    rejectOrder,
    getOrderById,
  };
};
