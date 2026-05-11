import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IncomeProvider } from './contexts/IncomeContext';
import { ExpenseProvider } from './contexts/ExpenseContext';
import { GoalProvider } from './contexts/GoalContext';
import { InvestmentProvider } from './contexts/InvestmentContext';
import { BudgetProvider } from './contexts/BudgetContext';

import { Layout } from './components/layout/Layout';
import { Login } from './modules/auth/Login';
import { Dashboard } from './modules/dashboard/Dashboard';
import { Income } from './modules/income/Income';
import { Expenses } from './modules/expenses/Expenses';
import { Goals } from './modules/goals/Goals';
import { Investments } from './modules/investments/Investments';
import { Planner } from './modules/planner/Planner';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};



function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="income" element={<Income />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="goals" element={<Goals />} />
        <Route path="investments" element={<Investments />} />
        <Route path="planner" element={<Planner />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <IncomeProvider>
        <ExpenseProvider>
          <GoalProvider>
            <InvestmentProvider>
              <BudgetProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </BudgetProvider>
            </InvestmentProvider>
          </GoalProvider>
        </ExpenseProvider>
      </IncomeProvider>
    </AuthProvider>
  );
}

export default App;
