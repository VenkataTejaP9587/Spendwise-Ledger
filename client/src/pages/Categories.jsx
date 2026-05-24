import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: '', subcategories: [] });
  const [newSub, setNewSub] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.icon.trim()) {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { ...formData, name: formData.name.trim(), icon: formData.icon.trim() });
      } else {
        await addCategory({ ...formData, name: formData.name.trim(), icon: formData.icon.trim() });
      }
      handleCloseModal();
      alert(`Category ${editingCategory ? 'updated' : 'added'} successfully!`);
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, icon: cat.icon, subcategories: [...cat.subcategories] });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', icon: '', subcategories: [] });
    setNewSub('');
  };

  const addSubcategory = () => {
    if (newSub.trim() && !formData.subcategories.includes(newSub.trim())) {
      setFormData(prev => ({ ...prev, subcategories: [...prev.subcategories, newSub.trim()] }));
      setNewSub('');
    }
  };

  const removeSubcategory = (index) => {
    setFormData(prev => ({ ...prev, subcategories: prev.subcategories.filter((_, i) => i !== index) }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Categories</h1>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>Add New Category</button>
      </div>

      <div className="category-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card">
            <div className="category-header">
              <span className="category-icon">{cat.icon}</span>
              <h3 className="category-name">{cat.name}</h3>
            </div>
            <div className="subcategory-list">
              {cat.subcategories.map(sub => (
                <span key={sub} className="subcategory-tag">{sub}</span>
              ))}
            </div>
            <div className="category-actions">
              <button className="btn btn--secondary btn--sm" onClick={() => handleEdit(cat)}>Edit</button>
              <button className="btn btn--outline btn--sm" onClick={() => handleDelete(cat.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className={`modal ${showModal ? '' : 'hidden'}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input type="text" className="form-control" value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Enter category name" required />
            </div>

            <div className="form-group">
              <label className="form-label">Icon (Emoji)</label>
              <input type="text" className="form-control" value={formData.icon}
                onChange={e => setFormData(p => ({ ...p, icon: e.target.value }))}
                placeholder="🏠" required />
            </div>

            <div className="form-group">
              <label className="form-label">Subcategories</label>
              <div className="subcategory-list">
                {formData.subcategories.map((sub, index) => (
                  <span key={index} className="subcategory-tag">
                    {sub}
                    <button type="button" onClick={() => removeSubcategory(index)}
                      style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input type="text" className="form-control" value={newSub}
                  onChange={e => setNewSub(e.target.value)} placeholder="New subcategory"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubcategory())} />
                <button type="button" className="btn btn--secondary btn--sm" onClick={addSubcategory}>Add</button>
              </div>
            </div>

            <div className="flex gap-8" style={{ marginTop: '24px' }}>
              <button type="submit" className="btn btn--primary">
                {editingCategory ? 'Update' : 'Create'} Category
              </button>
              <button type="button" className="btn btn--secondary" onClick={handleCloseModal}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Categories;
