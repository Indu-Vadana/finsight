'use client'
import { AuthProvider } from '../contexts/AuthContext';
import { IncomeProvider } from '../contexts/IncomeContext';
import { ExpenseProvider } from '../contexts/ExpenseContext';
import { GoalProvider } from '../contexts/GoalContext';
import { InvestmentProvider } from '../contexts/InvestmentContext';
import { BudgetProvider } from '../contexts/BudgetContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <IncomeProvider>
        <ExpenseProvider>
          <GoalProvider>
            <InvestmentProvider>
              <BudgetProvider>
                {children}
              </BudgetProvider>
            </InvestmentProvider>
          </GoalProvider>
        </ExpenseProvider>
      </IncomeProvider>
    </AuthProvider>
  );
}
