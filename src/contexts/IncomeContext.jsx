import React, { createContext, useContext, useState, useEffect } from 'react';
import { incomeService } from '../services/incomeService';
import { useAuth } from './AuthContext';

const IncomeContext = createContext();

export function IncomeProvider({ children }) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchIncomes();
    } else {
      setIncomes([]);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const data = await incomeService.getAll(currentUser.uid);
      setIncomes(data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addIncome = async (data) => {
    await incomeService.add(currentUser.uid, data);
    await fetchIncomes();
  };

  const updateIncome = async (id, data) => {
    await incomeService.update(id, data);
    await fetchIncomes();
  };

  const removeIncome = async (id) => {
    await incomeService.remove(id);
    await fetchIncomes();
  };

  return (
    <IncomeContext.Provider value={{ incomes, loading, addIncome, updateIncome, removeIncome, fetchIncomes }}>
      {children}
    </IncomeContext.Provider>
  );
}

export const useIncome = () => useContext(IncomeContext);
