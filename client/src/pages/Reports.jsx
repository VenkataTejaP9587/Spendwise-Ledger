import React from 'react';
import { useApp } from '../context/AppContext';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';

const Reports = () => {
  const { expenses, categories } = useApp();

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const categoryBreakdown = categories.map(cat => {
    const catExpenses = expenses.filter(e => e.category === cat.name);
    const total = catExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      category: cat.name,
      icon: cat.icon,
      total,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
      count: catExpenses.length,
    };
  }).filter(item => item.total > 0);

  const monthlyBreakdown = {};
  expenses.forEach(e => {
    const key = new Date(e.date).toISOString().slice(0, 7);
    monthlyBreakdown[key] = (monthlyBreakdown[key] || 0) + e.amount;
  });
  const monthlyData = Object.entries(monthlyBreakdown)
    .map(([month, amount]) => ({ label: month, value: amount }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(-6);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports &amp; Analytics</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">₹{totalExpenses.toFixed(2)}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{averageExpense.toFixed(2)}</div>
          <div className="stat-label">Average Expense</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categoryBreakdown.length}</div>
          <div className="stat-label">Active Categories</div>
        </div>
      </div>

      <div className="charts-grid">
        <PieChart data={categoryBreakdown.map(i => ({ label: i.category, value: i.total }))} title="Spending Distribution" />
        <BarChart data={monthlyData} title="Monthly Expenses" />
      </div>

      <div className="card">
        <div className="card__body">
          <h3 style={{ marginBottom: '16px' }}>Category Breakdown</h3>
          {categoryBreakdown.length > 0 ? categoryBreakdown.map(item => (
            <div key={item.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-card-border-inner)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{item.icon}</span>
                <span>{item.category}</span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>({item.count} transactions)</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)' }}>₹{item.total.toFixed(2)}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{item.percentage.toFixed(1)}%</div>
              </div>
            </div>
          )) : (
            <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '20px' }}>
              No expenses found. Start by adding your first expense!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
