// src/core/api/hooks/usePaymentWallets.ts
import { useState, useCallback } from "react";
import { api } from "../axios";

export type WalletType = "MPESA" | "EMOLA" | "BANK";

export interface PaymentWallet {
  id: number;
  walletType: WalletType;
  accountName: string;
  accountNumber: string;
  bankName?: string;
  active: boolean;
}

export interface CreateWalletDto {
  walletType: WalletType;
  accountName: string;
  accountNumber: string;
  bankName?: string;
  active?: boolean;
}

export const usePaymentWallets = () => {
  const [wallets, setWallets] = useState<PaymentWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async (instructorId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/wallets/instructor/${instructorId}`);
      if (response.data.status === "success") {
        setWallets(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao carregar carteiras";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createWallet = useCallback(async (instructorId: number, wallet: CreateWalletDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/wallets/instructor/${instructorId}`, wallet);
      if (response.data.status === "success") {
        setWallets(prev => [...prev, response.data.data]);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao criar carteira";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWallet = useCallback(async (walletId: number, wallet: CreateWalletDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/wallets/${walletId}`, wallet);
      if (response.data.status === "success") {
        setWallets(prev => prev.map(w => w.id === walletId ? response.data.data : w));
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao atualizar carteira";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteWallet = useCallback(async (walletId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/wallets/${walletId}`);
      if (response.data.status === "success") {
        setWallets(prev => prev.filter(w => w.id !== walletId));
        return true;
      }
      throw new Error(response.data.message);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao remover carteira";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    wallets,
    loading,
    error,
    fetchWallets,
    createWallet,
    updateWallet,
    deleteWallet,
  };
};
