'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import { useAuth } from './AuthContext';

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const data = await budgetService.getAll(currentUser.uid);
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchBudgets();
    } else {
      setBudgets([]);
      setLoading(false);
    }
  }, [currentUser]);

  const addBudget = async (data) => {
    await budgetService.add(currentUser.uid, data);
    await fetchBudgets();
  };

  const updateBudget = async (id, data) => {
    await budgetService.update(id, data);
    await fetchBudgets();
  };

  const removeBudget = async (id) => {
    await budgetService.remove(id);
    await fetchBudgets();
  };

  return (
    <BudgetContext.Provider value={{ budgets, loading, addBudget, updateBudget, removeBudget, fetchBudgets }}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => useContext(BudgetContext);
