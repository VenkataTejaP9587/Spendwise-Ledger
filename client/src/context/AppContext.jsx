import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        axios.get(`/api/expenses?userEmail=${encodeURIComponent(user.email)}`),
        axios.get(`/api/categories?userEmail=${encodeURIComponent(user.email)}`),
      ]).then(([expRes, catRes]) => {
        setExpenses(expRes.data);
        setCategories(catRes.data);
      }).finally(() => setLoading(false));
    } else {
      setExpenses([]);
      setCategories([]);
    }
  }, [user]);

  const addExpense = async (expense) => {
    if (!user) return;
    const res = await axios.post('/api/expenses', { ...expense, userEmail: user.email });
    setExpenses(prev => [...prev, res.data]);
  };

  const deleteExpense = async (id) => {
    if (!user) return;
    await axios.delete(`/api/expenses/${id}`);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addCategory = async (category) => {
    if (!user) return;
    const res = await axios.post('/api/categories', { ...category, userEmail: user.email });
    setCategories(prev => [...prev, res.data]);
  };

  const updateCategory = async (id, updated) => {
    if (!user) return;
    const res = await axios.put(`/api/categories/${id}`, { ...updated, userEmail: user.email });
    setCategories(prev => prev.map(c => c.id === id ? res.data : c));
  };

  const deleteCategory = async (id) => {
    if (!user) return;
    await axios.delete(`/api/categories/${id}`);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      expenses, categories, loading,
      addExpense, deleteExpense,
      addCategory, updateCategory, deleteCategory,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
