const { useState, useEffect, useContext, createContext } = React;

// Initial data
const initialCategories = [
  {
    id: 1,
    name: "Home",
    icon: "🏠",
    subcategories: ["Rent", "Electricity Bill", "Water Bill", "Groceries", "Maintenance", "Internet", "Phone Bill"]
  },
  {
    id: 2,
    name: "Travel",
    icon: "✈️",
    subcategories: ["Flights", "Hotels", "Meals", "Local Transport", "Car Rental", "Travel Insurance"]
  },
  {
    id: 3,
    name: "Studies",
    icon: "📚",
    subcategories: ["Books", "Online Courses", "Stationery", "Tuition", "Research Materials", "Software"]
  },
  {
    id: 4,
    name: "Trips",
    icon: "🎒",
    subcategories: ["Entertainment", "Activities", "Souvenirs", "Photography", "Tours", "Equipment"]
  }
];

const initialExpenses = [
  {
    id: 1,
    amount: 1200,
    category: "Home",
    subcategory: "Rent",
    description: "Monthly rent payment",
    date: "2024-01-01"
  },
  {
    id: 2,
    amount: 80,
    category: "Home",
    subcategory: "Electricity Bill",
    description: "January electricity bill",
    date: "2024-01-05"
  },
  {
    id: 3,
    amount: 300,
    category: "Home",
    subcategory: "Groceries",
    description: "Weekly grocery shopping",
    date: "2024-01-03"
  },
  {
    id: 4,
    amount: 450,
    category: "Travel",
    subcategory: "Flights",
    description: "Round trip tickets to Paris",
    date: "2024-01-10"
  },
  {
    id: 5,
    amount: 200,
    category: "Travel",
    subcategory: "Hotels",
    description: "Hotel booking for 3 nights",
    date: "2024-01-12"
  },
  {
    id: 6,
    amount: 150,
    category: "Studies",
    subcategory: "Books",
    description: "Programming textbooks",
    date: "2024-01-08"
  },
  {
    id: 7,
    amount: 99,
    category: "Studies",
    subcategory: "Online Courses",
    description: "React.js course subscription",
    date: "2024-01-15"
  }
];

// Context for app state
const AppContext = createContext();

// Authentication component
const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password');
      return;
    }
    
    if (!isLogin && !name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    // Simulate successful login
    const userData = {
      email: email.trim(),
      name: isLogin ? (name.trim() || email.split('@')[0]) : name.trim()
    };
    
    onLogin(userData);
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsLogin(!isLogin);
    setName('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        <p style={{textAlign: 'center', marginBottom: '20px', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)'}}>
          Demo credentials: demo@example.com / password
        </p>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required={!isLogin}
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn--primary btn--full-width">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Sidebar component
const Sidebar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add-expense', label: 'Add Expense', icon: '➕' },
    { id: 'expenses', label: 'Expense History', icon: '📋' },
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'reports', label: 'Reports', icon: '📈' }
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Expense Tracker</h2>
        <div className="sidebar-user">Welcome, {user.name}</div>
      </div>
      <ul className="sidebar-nav">
        {navItems.map(item => (
          <li key={item.id}>
            <button
              className={currentPage === item.id ? 'active' : ''}
              onClick={() => setCurrentPage(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

// Chart components
const PieChart = ({ data, title }) => {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current && data.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.map(item => item.label),
          datasets: [{
            data: data.map(item => item.value),
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--color-text-secondary)'}}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

const BarChart = ({ data, title }) => {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current && data.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.label),
          datasets: [{
            label: 'Amount ($)',
            data: data.map(item => item.value),
            backgroundColor: '#1FB8CD',
            borderColor: '#1FB8CD',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--color-text-secondary)'}}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  const { expenses, categories } = useContext(AppContext);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const categoryData = categories.map(category => ({
    label: category.name,
    value: expenses.filter(expense => expense.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).filter(item => item.value > 0);

  const monthlyData = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < 6; i++) {
    const monthIndex = (new Date().getMonth() - i + 12) % 12;
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === currentYear;
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    monthlyData.unshift({
      label: months[monthIndex],
      value: monthExpenses
    });
  }

  const recentExpenses = expenses.slice(-5).reverse();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">${totalExpenses.toFixed(2)}</div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${thisMonthExpenses.toFixed(2)}</div>
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
              <div className="recent-expense-amount">${expense.amount.toFixed(2)}</div>
            </div>
          ))
        ) : (
          <div style={{color: 'var(--color-text-secondary)', textAlign: 'center', padding: '20px'}}>
            No expenses yet. Start by adding your first expense!
          </div>
        )}
      </div>
    </div>
  );
};

// Add Expense component
const AddExpense = () => {
  const { categories, addExpense } = useContext(AppContext);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    subcategory: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.category && formData.subcategory && formData.description) {
      addExpense({
        ...formData,
        amount: parseFloat(formData.amount),
        id: Date.now()
      });
      setFormData({
        amount: '',
        category: '',
        subcategory: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      alert('Expense added successfully!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subcategory: '' } : {})
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
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="amount"
                className="form-control"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subcategory</label>
              <select
                name="subcategory"
                className="form-control"
                value={formData.subcategory}
                onChange={handleChange}
                required
                disabled={!selectedCategory}
              >
                <option value="">Select Subcategory</option>
                {selectedCategory?.subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter expense description"
              required
            />
          </div>
          
          <button type="submit" className="btn btn--primary">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

// Expense History component
const ExpenseHistory = () => {
  const { expenses, categories, deleteExpense } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    const matchesDate = !dateFilter || expense.date.includes(dateFilter);
    
    return matchesSearch && matchesCategory && matchesDate;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setDateFilter('');
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
            <input
              type="text"
              className="form-control"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Month</label>
            <input
              type="month"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn--secondary"
              onClick={clearFilters}
            >
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
        
        {filteredExpenses.map(expense => (
          <div key={expense.id} className="expense-item">
            <div className="expense-description">{expense.description}</div>
            <div className="expense-category">
              {categories.find(cat => cat.name === expense.category)?.icon} {expense.category} • {expense.subcategory}
            </div>
            <div className="expense-amount">${expense.amount.toFixed(2)}</div>
            <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
            <div className="expense-actions">
              <button
                className="btn-icon btn-delete"
                onClick={() => handleDelete(expense.id)}
                title="Delete expense"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        
        {filteredExpenses.length === 0 && (
          <div className="expense-item">
            <div style={{gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-secondary)'}}>
              {expenses.length === 0 ? 'No expenses found. Start by adding your first expense!' : 'No expenses found matching your criteria.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Categories component
const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    subcategories: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.icon.trim()) {
      if (editingCategory) {
        updateCategory(editingCategory.id, {
          ...formData,
          name: formData.name.trim(),
          icon: formData.icon.trim()
        });
      } else {
        addCategory({
          ...formData,
          name: formData.name.trim(),
          icon: formData.icon.trim(),
          id: Date.now()
        });
      }
      handleCloseModal();
      alert(`Category ${editingCategory ? 'updated' : 'added'} successfully!`);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      subcategories: [...category.subcategories]
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      icon: '',
      subcategories: []
    });
  };

  const addSubcategory = () => {
    const subcategory = prompt('Enter subcategory name:');
    if (subcategory && subcategory.trim() && !formData.subcategories.includes(subcategory.trim())) {
      setFormData(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, subcategory.trim()]
      }));
    }
  };

  const removeSubcategory = (index) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this category? This will affect related expenses.')) {
      deleteCategory(id);
      alert('Category deleted successfully!');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Categories</h1>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          Add New Category
        </button>
      </div>
      
      <div className="category-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <h3 className="category-name">{category.name}</h3>
            </div>
            
            <div className="subcategory-list">
              {category.subcategories.map(sub => (
                <span key={sub} className="subcategory-tag">{sub}</span>
              ))}
            </div>
            
            <div className="category-actions">
              <button
                className="btn btn--secondary btn--sm"
                onClick={() => handleEdit(category)}
              >
                Edit
              </button>
              <button
                className="btn btn--outline btn--sm"
                onClick={() => handleDelete(category.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div className={`modal ${showModal ? '' : 'hidden'}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="Enter category name"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Icon (Emoji)</label>
              <input
                type="text"
                className="form-control"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({...prev, icon: e.target.value}))}
                placeholder="🏠"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Subcategories</label>
              <div className="subcategory-list">
                {formData.subcategories.map((sub, index) => (
                  <span key={index} className="subcategory-tag">
                    {sub}
                    <button
                      type="button"
                      onClick={() => removeSubcategory(index)}
                      style={{marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer'}}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={addSubcategory}
                style={{marginTop: '8px'}}
              >
                Add Subcategory
              </button>
            </div>
            
            <div className="flex gap-8" style={{marginTop: '24px'}}>
              <button type="submit" className="btn btn--primary">
                {editingCategory ? 'Update' : 'Create'} Category
              </button>
              <button type="button" className="btn btn--secondary" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reports component
const Reports = () => {
  const { expenses, categories } = useContext(AppContext);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const categoryBreakdown = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category.name);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = totalExpenses > 0 ? (total / totalExpenses * 100) : 0;
    
    return {
      category: category.name,
      icon: category.icon,
      total,
      percentage,
      count: categoryExpenses.length
    };
  }).filter(item => item.total > 0);

  const monthlyBreakdown = {};
  expenses.forEach(expense => {
    const monthYear = new Date(expense.date).toISOString().slice(0, 7);
    if (!monthlyBreakdown[monthYear]) {
      monthlyBreakdown[monthYear] = 0;
    }
    monthlyBreakdown[monthYear] += expense.amount;
  });

  const monthlyData = Object.entries(monthlyBreakdown)
    .map(([month, amount]) => ({ label: month, value: amount }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(-6);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">${totalExpenses.toFixed(2)}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${averageExpense.toFixed(2)}</div>
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
        <PieChart 
          data={categoryBreakdown.map(item => ({label: item.category, value: item.total}))} 
          title="Spending Distribution" 
        />
        <BarChart data={monthlyData} title="Monthly Expenses" />
      </div>

      <div className="card">
        <div className="card__body">
          <h3 style={{marginBottom: '16px'}}>Category Breakdown</h3>
          {categoryBreakdown.length > 0 ? (
            categoryBreakdown.map(item => (
              <div key={item.category} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-card-border-inner)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>{item.icon}</span>
                  <span>{item.category}</span>
                  <span style={{color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)'}}>
                    ({item.count} transactions)
                  </span>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)'}}>
                    ${item.total.toFixed(2)}
                  </div>
                  <div style={{fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)'}}>
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{color: 'var(--color-text-secondary)', textAlign: 'center', padding: '20px'}}>
              No expenses found. Start by adding your first expense!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [categories, setCategories] = useState(initialCategories);
  const [expenses, setExpenses] = useState(initialExpenses);

  const addExpense = (expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const addCategory = (category) => {
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = (id, updatedCategory) => {
    setCategories(prev => prev.map(cat => cat.id === id ? {...cat, ...updatedCategory} : cat));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const appContextValue = {
    expenses,
    categories,
    addExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'add-expense':
        return <AddExpense />;
      case 'expenses':
        return <ExpenseHistory />;
      case 'categories':
        return <Categories />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="app">
        <div className="main-layout">
          <Sidebar 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            user={user}
            onLogout={handleLogout}
          />
          <div className="main-content">
            {renderPage()}
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));