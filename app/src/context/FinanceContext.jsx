import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Mock Data ---
const initialUser = {
  id: "u1",
  name: "Alex Doe",
  email: "alex@jmsolutionss.com",
  avatar: "https://ui-avatars.com/api/?name=Alex+Doe&background=2E3A8C&color=fff",
  currency: "USD",
  monthlySpendingLimit: 2500,
  createdAt: Date.now()
};

const initialTransactions = [
  { id: "t1", type: "income", amount: 4500, category: "Salary", recipientName: "JM Solutionss", status: "completed", date: Date.now() - 86400000 * 2, notes: "Monthly Salary" },
  { id: "t2", type: "expense", amount: 120, category: "Food & Grocery", recipientName: "Whole Foods", status: "completed", date: Date.now() - 86400000 * 1, notes: "Groceries" },
  { id: "t3", type: "expense", amount: 15.99, category: "Subscriptions", recipientName: "Netflix", status: "completed", date: Date.now() - 86400000 * 3, notes: "" },
  { id: "t4", type: "expense", amount: 50, category: "Transportation", recipientName: "Uber", status: "pending", date: Date.now(), notes: "Ride to airport" },
];

const initialCards = [
  { id: "c1", cardNumber: "4111222233334444", cardholderName: "Alex Doe", expiryDate: "12/25", cardType: "visa", nickname: "Everyday Spend", createdAt: Date.now() },
  { id: "c2", cardNumber: "5500000000001234", cardholderName: "Alex Doe", expiryDate: "08/26", cardType: "mastercard", nickname: "Travel Card", createdAt: Date.now() }
];

const initialGoals = [
  { id: "g1", name: "Emergency Fund", targetAmount: 10000, currentAmount: 4500, targetDate: Date.now() + 86400000 * 180, createdAt: Date.now() },
  { id: "g2", name: "Vacation", targetAmount: 3000, currentAmount: 1200, targetDate: Date.now() + 86400000 * 90, createdAt: Date.now() }
];

const initialBudgets = [
  { id: "b1", category: "Food & Grocery", allocatedAmount: 500, spentAmount: 120, month: "2026-04" },
  { id: "b2", category: "Entertainment", allocatedAmount: 200, spentAmount: 50, month: "2026-04" },
  { id: "b3", category: "Travelling", allocatedAmount: 300, spentAmount: 50, month: "2026-04" }
];

// --- Custom Hook ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  };

  return [storedValue, setValue];
}

// --- Context ---
const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('jm_user', initialUser);
  const [transactions, setTransactions] = useLocalStorage('jm_transactions', initialTransactions);
  const [cards, setCards] = useLocalStorage('jm_cards', initialCards);
  const [goals, setGoals] = useLocalStorage('jm_goals', initialGoals);
  const [budgets, setBudgets] = useLocalStorage('jm_budgets', initialBudgets);

  // Derived State
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const addTransaction = (transaction) => {
    setTransactions([
      { id: `t${Date.now()}`, ...transaction, date: Date.now() },
      ...transactions
    ]);
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addCard = (card) => {
    setCards([
      { id: `c${Date.now()}`, ...card, createdAt: Date.now() },
      ...cards
    ]);
  };

  const deleteCard = (id) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const updateGoal = (id, updatedData) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updatedData } : g));
  };

  const addGoal = (goal) => {
    setGoals([
      { id: `g${Date.now()}`, ...goal, currentAmount: 0, createdAt: Date.now() },
      ...goals
    ]);
  };

  const value = {
    user, setUser,
    transactions, setTransactions, addTransaction, deleteTransaction, updateTransaction,
    cards, setCards, addCard, deleteCard,
    goals, setGoals, updateGoal, addGoal,
    budgets, setBudgets,
    metrics: {
      totalIncome,
      totalExpense,
      totalBalance
    }
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
