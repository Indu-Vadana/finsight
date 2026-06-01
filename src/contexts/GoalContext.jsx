'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { goalService } from '../services/goalService';
import { useAuth } from './AuthContext';

const GoalContext = createContext();

export function GoalProvider({ children }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const data = await goalService.getAll(currentUser.uid);
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchGoals();
    } else {
      setGoals([]);
      setLoading(false);
    }
  }, [currentUser]);

  const addGoal = async (data) => {
    await goalService.add(currentUser.uid, data);
    await fetchGoals();
  };

  const updateGoal = async (id, data) => {
    await goalService.update(id, data);
    await fetchGoals();
  };

  const removeGoal = async (id) => {
    await goalService.remove(id);
    await fetchGoals();
  };

  return (
    <GoalContext.Provider value={{ goals, loading, addGoal, updateGoal, removeGoal, fetchGoals }}>
      {children}
    </GoalContext.Provider>
  );
}

export const useGoal = () => useContext(GoalContext);
