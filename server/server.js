const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Helper: read data
function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

// Helper: write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ----- AUTH -----
app.post('/api/auth/login', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const userName = name || email.split('@')[0];
  res.json({ user: { email, name: userName } });
});

// ----- EXPENSES -----
app.get('/api/expenses', (req, res) => {
  const data = readData();
  const userEmail = req.query.userEmail;
  if (!userEmail) return res.json([]);
  res.json(data.expenses.filter(e => e.userEmail === userEmail));
});

app.post('/api/expenses', (req, res) => {
  const data = readData();
  const newExpense = {
    id: Date.now(),
    ...req.body
  };
  data.expenses.push(newExpense);
  writeData(data);
  res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.expenses.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  data.expenses.splice(index, 1);
  writeData(data);
  res.json({ message: 'Expense deleted' });
});

// ----- CATEGORIES -----
app.get('/api/categories', (req, res) => {
  const data = readData();
  const userEmail = req.query.userEmail;
  if (!userEmail) {
    return res.json(data.categories.filter(c => !c.userEmail));
  }
  res.json(data.categories.filter(c => !c.userEmail || c.userEmail === userEmail));
});

app.post('/api/categories', (req, res) => {
  const data = readData();
  const newCategory = {
    id: Date.now(),
    ...req.body
  };
  data.categories.push(newCategory);
  writeData(data);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  data.categories[index] = { ...data.categories[index], ...req.body, id };
  writeData(data);
  res.json(data.categories[index]);
});

app.delete('/api/categories/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  data.categories.splice(index, 1);
  writeData(data);
  res.json({ message: 'Category deleted' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
