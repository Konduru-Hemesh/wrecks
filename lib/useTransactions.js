'use client';

import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from './apiConfig';
import { toast } from 'sonner';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.expenses || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();

    // Listen for transaction updates
    const handleUpdate = () => {
      fetchTransactions();
    };

    window.addEventListener('transactionsUpdated', handleUpdate);
    return () => {
      window.removeEventListener('transactionsUpdated', handleUpdate);
    };
  }, [fetchTransactions]);

  // Calculate totals by category
  const categoryTotals = transactions.reduce((acc, transaction) => {
    const category = transaction.category || 'other-expense';
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {});

  // Calculate total spending
  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Get transactions by date range
  const getTransactionsByDateRange = (startDate, endDate) => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  // Get current month transactions
  const getCurrentMonthTransactions = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return getTransactionsByDateRange(startOfMonth, endOfMonth);
  };

  // Get transactions grouped by day
  const getTransactionsByDay = () => {
    const grouped = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  };

  return {
    transactions,
    loading,
    error,
    categoryTotals,
    totalSpending,
    getTransactionsByDateRange,
    getCurrentMonthTransactions,
    getTransactionsByDay,
    refetch: fetchTransactions,
  };
}
