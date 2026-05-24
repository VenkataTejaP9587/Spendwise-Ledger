import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ExpenseHistory = () => {
  const { expenses, categories, deleteExpense } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = expenses.filter(e => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || e.category === categoryFilter;
    const matchesDate = !dateFilter || e.date.includes(dateFilter);
    return matchesSearch && matchesCategory && matchesDate;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Expense History</h1>
      </div>

      <div className="search-filters">
        <div className="search-row">
          <div className="form-group">
            <label className="form-label">Search</label>
            <input type="text" className="form-control" placeholder="Search expenses..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Month</label>
            <input type="month" className="form-control" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
          <div className="form-group">
            <button className="btn btn--secondary" onClick={() => { setSearchTerm(''); setCategoryFilter(''); setDateFilter(''); }}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="expense-list">
        <div className="expense-list-header">
          <div className="expense-item">
            <div><strong>Description</strong></div>
            <div><strong>Category</strong></div>
            <div><strong>Amount</strong></div>
            <div><strong>Date</strong></div>
            <div><strong>Actions</strong></div>
          </div>
        </div>

        {filtered.map(expense => (
          <div key={expense.id} className="expense-item">
            <div className="expense-description">{expense.description}</div>
            <div className="expense-category">
              {categories.find(c => c.name === expense.category)?.icon} {expense.category} • {expense.subcategory}
            </div>
            <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
            <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
            <div className="expense-actions">
              <button className="btn-icon btn-delete" onClick={() => handleDelete(expense.id)} title="Delete expense">
                🗑️
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="expense-item">
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              {expenses.length === 0 ? 'No expenses found. Start by adding your first expense!' : 'No expenses match your criteria.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory;
