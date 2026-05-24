import React from 'react';

const Sidebar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add-expense', label: 'Add Expense', icon: '➕' },
    { id: 'expenses', label: 'Expense History', icon: '📋' },
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ];

  const handleLogout = () => {
    onLogout();
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

export default Sidebar;
