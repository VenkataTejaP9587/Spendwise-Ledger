import React from 'react';
import { useApp } from '../context/AppContext';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';

const Dashboard = () => {
  const { expenses, categories } = useApp();

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, e) => sum + e.amount, 0);

  const categoryData = categories.map(cat => ({
    label: cat.name,
    value: expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0),
  })).filter(item => item.value > 0);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (new Date().getMonth() - i + 12) % 12;
    const total = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === monthIndex && d.getFullYear() === currentYear;
    }).reduce((sum, e) => sum + e.amount, 0);
    monthlyData.push({ label: months[monthIndex], value: total });
  }

  const recentExpenses = [...expenses].reverse().slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">₹{totalExpenses.toFixed(2)}</div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{thisMonthExpenses.toFixed(2)}</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      <div className="charts-grid">
        <PieChart data={categoryData} title="Expenses by Category" />
        <BarChart data={monthlyData} title="Monthly Spending Trend" />
      </div>

      <div className="recent-expenses">
        <h3>Recent Expenses</h3>
        {recentExpenses.length > 0 ? (
          recentExpenses.map(expense => (
            <div key={expense.id} className="recent-expense-item">
              <div className="recent-expense-info">
                <div className="recent-expense-desc">{expense.description}</div>
                <div className="recent-expense-cat">{expense.category} • {expense.subcategory}</div>
              </div>
              <div className="recent-expense-amount">₹{expense.amount.toFixed(2)}</div>
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '20px' }}>
            No expenses yet. Start by adding your first expense!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
