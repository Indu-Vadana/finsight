'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getAll(currentUser.uid);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [currentUser]);

  const addExpense = async (data) => {
    await expenseService.add(currentUser.uid, data);
    await fetchExpenses();
  };

  const updateExpense = async (id, data) => {
    await expenseService.update(id, data);
    await fetchExpenses();
  };

  const removeExpense = async (id) => {
    await expenseService.remove(id);
    await fetchExpenses();
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, addExpense, updateExpense, removeExpense, fetchExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => useContext(ExpenseContext);
