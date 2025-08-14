const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, '..', 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const TOKEN_EXPIRES_IN = '7d';

function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const db = readDB();
    const existing = db.users.find(u => u.email === email);
    if (existing) return res.status(400).json({ message: 'Email exists' });

    const hashed = await bcrypt.hash(password, 10);
    const id = Math.random().toString(36).slice(2, 8);
    const user = { id, name, email, password: hashed };
    db.users.push(user);
    writeDB(db);

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
    const { password: _pw, ...safe } = user;
    res.json({ token, user: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const db = readDB();
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
    const { password: _pw, ...safe } = user;
    res.json({ token, user: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Tasks endpoints (protected where modification occurs)
app.get('/tasks', (req, res) => {
  const db = readDB();
  const { userId } = req.query;
  if (userId) {
    return res.json(db.tasks.filter(t => t.userId === userId));
  }
  res.json(db.tasks);
});

app.post('/tasks', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const task = req.body;
    task.id = Math.random().toString(36).slice(2, 8);
    task.userId = req.userId;
    task.createdAt = new Date().toISOString();
    db.tasks.push(task);
    writeDB(db);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/tasks/:id', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const idx = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    const updated = { ...db.tasks[idx], ...req.body };
    db.tasks[idx] = updated;
    writeDB(db);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/tasks/:id', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const idx = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    const updated = { ...db.tasks[idx], ...req.body };
    db.tasks[idx] = updated;
    writeDB(db);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/tasks/:id', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const idx = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.userId);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    const removed = db.tasks.splice(idx, 1)[0];
    writeDB(db);
    res.json(removed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Users endpoint (for admin/demo) - do not expose in production
app.get('/users', (req, res) => {
  const db = readDB();
  res.json(db.users.map(u => ({ id: u.id, name: u.name, email: u.email })));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth server listening on ${PORT}`));
