import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AddExpense = () => {
  const { categories, addExpense } = useApp();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    subcategory: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.amount && formData.category && formData.subcategory && formData.description) {
      await addExpense({ ...formData, amount: parseFloat(formData.amount) });
      setFormData({ amount: '', category: '', subcategory: '', description: '', date: new Date().toISOString().split('T')[0] });
      alert('Expense added successfully!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subcategory: '' } : {}),
    }));
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add New Expense</h1>
      </div>

      <div className="expense-form">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input type="number" step="0.01" min="0" name="amount" className="form-control"
                value={formData.amount} onChange={handleChange} placeholder="0.00" required />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" name="date" className="form-control"
                value={formData.date} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subcategory</label>
              <select name="subcategory" className="form-control" value={formData.subcategory}
                onChange={handleChange} required disabled={!selectedCategory}>
                <option value="">Select Subcategory</option>
                {selectedCategory?.subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input type="text" name="description" className="form-control"
              value={formData.description} onChange={handleChange}
              placeholder="Enter expense description" required />
          </div>

          <button type="submit" className="btn btn--primary">Add Expense</button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
