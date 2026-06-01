'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { investmentService } from '../services/investmentService';
import { useAuth } from './AuthContext';

const InvestmentContext = createContext();

export function InvestmentProvider({ children }) {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const data = await investmentService.getAll(currentUser.uid);
      setInvestments(data);
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchInvestments();
    } else {
      setInvestments([]);
      setLoading(false);
    }
  }, [currentUser]);

  const addInvestment = async (data) => {
    await investmentService.add(currentUser.uid, data);
    await fetchInvestments();
  };

  const updateInvestment = async (id, data) => {
    await investmentService.update(id, data);
    await fetchInvestments();
  };

  const removeInvestment = async (id) => {
    await investmentService.remove(id);
    await fetchInvestments();
  };

  return (
    <InvestmentContext.Provider value={{ investments, loading, addInvestment, updateInvestment, removeInvestment, fetchInvestments }}>
      {children}
    </InvestmentContext.Provider>
  );
}

export const useInvestment = () => useContext(InvestmentContext);
