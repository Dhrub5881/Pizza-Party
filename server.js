/**
 * Pizza Party Dehradun — Backend API Server
 * In-memory data store (swap to MongoDB/PostgreSQL for production)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'pizza_party_secret';

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
app.use(express.json());

// ─── IN-MEMORY DATABASE ───────────────────────────────────────────────────────
const DB = {
  users: [],
  orders: [
    {
      id: 'PP-2024-8821',
      userId: null,
      customer: 'Rahul Sharma',
      phone: '9876543210',
      items: [
        { menuItemId: 7, name: 'Pepperoni Feast', qty: 1, price: 379 },
        { menuItemId: 9, name: 'Garlic Breadsticks', qty: 2, price: 99 }
      ],
      subtotal: 577,
      discount: 0,
      deliveryFee: 0,
      tax: 29,
      total: 606,
      status: 'preparing',
      payment: 'paid',
      method: 'UPI',
      address: '45 Saharanpur Rd, Dehradun',
      agentId: 'AGT-001',
      agentName: 'Ravi Kumar',
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'PP-2024-8820',
      userId: null,
      customer: 'Priya Singh',
      phone: '9876543211',
      items: [{ menuItemId: 2, name: 'Paneer Tikka Special', qty: 2, price: 299 }],
      subtotal: 598,
      discount: 0,
      deliveryFee: 0,
      tax: 30,
      total: 628,
      status: 'delivered',
      payment: 'paid',
      method: 'Card',
      address: '12 Rajpur Rd',
      agentId: 'AGT-002',
      agentName: 'Amit Jha',
      createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'PP-2024-8819',
      userId: null,
      customer: 'Arjun Mehta',
      phone: '9876543212',
      items: [
        { menuItemId: 6, name: 'Chicken BBQ', qty: 1, price: 349 },
        { menuItemId: 13, name: 'Pepsi', qty: 2, price: 49 }
      ],
      subtotal: 447,
      discount: 0,
      deliveryFee: 49,
      tax: 22,
      total: 518,
      status: 'otw',
      payment: 'paid',
      method: 'COD',
      address: '78 Clock Tower',
      agentId: 'AGT-003',
      agentName: 'Suresh Das',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'PP-2024-8818',
      userId: null,
      customer: 'Neha Gupta',
      phone: '9876543213',
      items: [{ menuItemId: 16, name: 'Party Pack', qty: 1, price: 599 }],
      subtotal: 599,
      discount: 0,
      deliveryFee: 0,
      tax: 30,
      total: 629,
      status: 'received',
      payment: 'pending',
      method: 'UPI',
      address: '23 Paltan Bazaar',
      agentId: null,
      agentName: '—',
      createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  menu: [
    // ── VEG PIZZAS ──────────────────────────────────────────────────────────
    {
      id: 1, name: 'Margherita Classic', cat: 'pizza', type: 'veg', emoji: '🍕',
      sizes: [
        { label: 'Small (7")',  price: 149, oldPrice: 199 },
        { label: 'Medium (10")', price: 199, oldPrice: 249 },
        { label: 'Large (12")', price: 279, oldPrice: 349 },
        { label: 'XL (14")',   price: 349, oldPrice: 429 }
      ],
      price: 199, oldPrice: 249,
      desc: 'Fresh tomato sauce, mozzarella, basil leaves on hand-tossed base',
      bestseller: true, rating: 4.5, available: true
    },
    {
      id: 2, name: 'Paneer Tikka Special', cat: 'pizza', type: 'veg', emoji: '🧀',
      sizes: [
        { label: 'Small (7")',  price: 199, oldPrice: 259 },
        { label: 'Medium (10")', price: 299, oldPrice: 349 },
        { label: 'Large (12")', price: 379, oldPrice: 449 },
        { label: 'XL (14")',   price: 459, oldPrice: 549 }
      ],
      price: 299, oldPrice: 349,
      desc: 'Marinated paneer, bell peppers, onions, tikka sauce, cheese burst',
      bestseller: true, rating: 4.7, available: true
    },
    {
      id: 3, name: 'Farm House', cat: 'pizza', type: 'veg', emoji: '🌽',
      sizes: [
        { label: 'Small (7")',  price: 179, oldPrice: 229 },
        { label: 'Medium (10")', price: 279, oldPrice: 329 },
        { label: 'Large (12")', price: 359, oldPrice: 429 },
        { label: 'XL (14")',   price: 439, oldPrice: 519 }
      ],
      price: 279, oldPrice: 329,
      desc: 'Mushroom, capsicum, babycorn, paneer, golden corn, olives',
      bestseller: false, rating: 4.3, available: true
    },
    {
      id: 4, name: 'Double Cheese', cat: 'pizza', type: 'veg', emoji: '🧀',
      sizes: [
        { label: 'Small (7")',  price: 159, oldPrice: 199 },
        { label: 'Medium (10")', price: 259, oldPrice: 299 },
        { label: 'Large (12")', price: 339, oldPrice: 399 },
        { label: 'XL (14")',   price: 419, oldPrice: 499 }
      ],
      price: 259, oldPrice: 299,
      desc: 'Extra mozzarella, cheese burst crust, garlic drizzle',
      bestseller: false, rating: 4.4, available: true
    },
    {
      id: 5, name: 'Veggie Supreme', cat: 'pizza', type: 'veg', emoji: '🥦',
      sizes: [
        { label: 'Small (7")',  price: 219, oldPrice: 269 },
        { label: 'Medium (10")', price: 319, oldPrice: 369 },
        { label: 'Large (12")', price: 399, oldPrice: 469 },
        { label: 'XL (14")',   price: 479, oldPrice: 559 }
      ],
      price: 319, oldPrice: 369,
      desc: 'Garden fresh veggies, jalapeno, red paprika, tangy tomato sauce',
      bestseller: false, rating: 4.2, available: true
    },
    {
      id: 20, name: 'Cheese & Corn Delight', cat: 'pizza', type: 'veg', emoji: '🌽',
      sizes: [
        { label: 'Small (7")',  price: 169, oldPrice: 219 },
        { label: 'Medium (10")', price: 269, oldPrice: 319 },
        { label: 'Large (12")', price: 349, oldPrice: 419 },
        { label: 'XL (14")',   price: 429, oldPrice: 509 }
      ],
      price: 269, oldPrice: 319,
      desc: 'Sweet golden corn, mozzarella, tangy tomato base',
      bestseller: false, rating: 4.1, available: true
    },
    // ── NON-VEG PIZZAS ───────────────────────────────────────────────────────
    {
      id: 6, name: 'Chicken BBQ', cat: 'pizza', type: 'nonveg', emoji: '🍗',
      sizes: [
        { label: 'Small (7")',  price: 249, oldPrice: 299 },
        { label: 'Medium (10")', price: 349, oldPrice: 399 },
        { label: 'Large (12")', price: 449, oldPrice: 519 },
        { label: 'XL (14")',   price: 549, oldPrice: 629 }
      ],
      price: 349, oldPrice: 399,
      desc: 'Grilled chicken, BBQ sauce, caramelized onions, smoked paprika',
      bestseller: true, rating: 4.8, available: true
    },
    {
      id: 7, name: 'Pepperoni Feast', cat: 'pizza', type: 'nonveg', emoji: '🥩',
      sizes: [
        { label: 'Small (7")',  price: 279, oldPrice: 329 },
        { label: 'Medium (10")', price: 379, oldPrice: 429 },
        { label: 'Large (12")', price: 479, oldPrice: 549 },
        { label: 'XL (14")',   price: 579, oldPrice: 659 }
      ],
      price: 379, oldPrice: 429,
      desc: 'Premium pepperoni, extra cheese, Italian herbs, tomato base',
      bestseller: true, rating: 4.9, available: true
    },
    {
      id: 8, name: 'Chicken Tikka', cat: 'pizza', type: 'nonveg', emoji: '🌶️',
      sizes: [
        { label: 'Small (7")',  price: 259, oldPrice: 309 },
        { label: 'Medium (10")', price: 359, oldPrice: 409 },
        { label: 'Large (12")', price: 459, oldPrice: 529 },
        { label: 'XL (14")',   price: 559, oldPrice: 639 }
      ],
      price: 359, oldPrice: 409,
      desc: 'Spiced tikka chicken, paneer, onions, green chilies',
      bestseller: false, rating: 4.6, available: true
    },
    {
      id: 21, name: 'Mutton Keema Special', cat: 'pizza', type: 'nonveg', emoji: '🐑',
      sizes: [
        { label: 'Small (7")',  price: 299, oldPrice: 349 },
        { label: 'Medium (10")', price: 399, oldPrice: 459 },
        { label: 'Large (12")', price: 499, oldPrice: 579 },
        { label: 'XL (14")',   price: 599, oldPrice: 689 }
      ],
      price: 399, oldPrice: 459,
      desc: 'Spiced mutton keema, onions, green chilies, special masala sauce',
      bestseller: false, rating: 4.5, available: true
    },
    {
      id: 22, name: 'Double Chicken Loaded', cat: 'pizza', type: 'nonveg', emoji: '🍗',
      sizes: [
        { label: 'Small (7")',  price: 279, oldPrice: 339 },
        { label: 'Medium (10")', price: 389, oldPrice: 449 },
        { label: 'Large (12")', price: 489, oldPrice: 569 },
        { label: 'XL (14")',   price: 589, oldPrice: 679 }
      ],
      price: 389, oldPrice: 449,
      desc: 'Double chicken toppings, mozzarella, ranch drizzle',
      bestseller: false, rating: 4.4, available: true
    },
    // ── SIDES ────────────────────────────────────────────────────────────────
    {
      id: 9, name: 'Garlic Breadsticks', cat: 'sides', type: 'veg', emoji: '🥖',
      sizes: [
        { label: '4 pcs',  price: 79, oldPrice: 99 },
        { label: '8 pcs', price: 99, oldPrice: 129 }
      ],
      price: 99, oldPrice: 129,
      desc: 'Soft breadsticks with garlic butter dip & marinara',
      bestseller: true, rating: 4.5, available: true
    },
    {
      id: 10, name: 'Crispy Wings', cat: 'sides', type: 'nonveg', emoji: '🍗',
      sizes: [
        { label: '4 pcs',  price: 99, oldPrice: 129 },
        { label: '8 pcs', price: 179, oldPrice: 219 }
      ],
      price: 179, oldPrice: 219,
      desc: '8 pieces golden fried with buffalo or BBQ sauce',
      bestseller: false, rating: 4.4, available: true
    },
    {
      id: 11, name: 'Caesar Salad', cat: 'sides', type: 'veg', emoji: '🥗',
      sizes: [
        { label: 'Regular', price: 139, oldPrice: 169 }
      ],
      price: 139, oldPrice: 169,
      desc: 'Romaine, croutons, parmesan, Caesar dressing',
      bestseller: false, rating: 4.0, available: true
    },
    {
      id: 12, name: 'Loaded Fries', cat: 'sides', type: 'veg', emoji: '🍟',
      sizes: [
        { label: 'Regular', price: 79, oldPrice: 99 },
        { label: 'Large', price: 119, oldPrice: 149 }
      ],
      price: 119, oldPrice: 149,
      desc: 'Crispy fries with cheese sauce, jalapenos, herbs',
      bestseller: false, rating: 4.3, available: true
    },
    {
      id: 23, name: 'Paneer Bites', cat: 'sides', type: 'veg', emoji: '🧀',
      sizes: [
        { label: '6 pcs', price: 99, oldPrice: 129 },
        { label: '12 pcs', price: 179, oldPrice: 219 }
      ],
      price: 99, oldPrice: 129,
      desc: 'Crispy fried paneer cubes with mint chutney dip',
      bestseller: false, rating: 4.2, available: true
    },
    {
      id: 24, name: 'Choco Lava Cake', cat: 'sides', type: 'veg', emoji: '🍫',
      sizes: [
        { label: 'Single', price: 79, oldPrice: 99 },
        { label: 'Double', price: 139, oldPrice: 179 }
      ],
      price: 79, oldPrice: 99,
      desc: 'Warm chocolate cake with gooey molten center',
      bestseller: true, rating: 4.7, available: true
    },
    // ── DRINKS ───────────────────────────────────────────────────────────────
    {
      id: 13, name: 'Pepsi', cat: 'drinks', type: 'veg', emoji: '🥤',
      sizes: [
        { label: '250ml', price: 35, oldPrice: 45 },
        { label: '500ml', price: 49, oldPrice: 59 },
        { label: '1.25L', price: 89, oldPrice: 109 }
      ],
      price: 49, oldPrice: 59,
      desc: 'Chilled Pepsi 500ml',
      bestseller: false, rating: 4.0, available: true
    },
    {
      id: 14, name: 'Mango Smoothie', cat: 'drinks', type: 'veg', emoji: '🥭',
      sizes: [
        { label: 'Regular (300ml)', price: 89, oldPrice: 119 },
        { label: 'Large (500ml)', price: 129, oldPrice: 159 }
      ],
      price: 89, oldPrice: 119,
      desc: 'Fresh mango with cream, chilled',
      bestseller: true, rating: 4.6, available: true
    },
    {
      id: 15, name: 'Lemonade', cat: 'drinks', type: 'veg', emoji: '🍋',
      sizes: [
        { label: 'Regular (300ml)', price: 59, oldPrice: 79 },
        { label: 'Large (500ml)', price: 89, oldPrice: 109 }
      ],
      price: 69, oldPrice: 89,
      desc: 'Fresh squeezed with mint, served cold',
      bestseller: false, rating: 4.4, available: true
    },
    {
      id: 25, name: 'Cold Coffee', cat: 'drinks', type: 'veg', emoji: '☕',
      sizes: [
        { label: 'Regular (300ml)', price: 79, oldPrice: 99 },
        { label: 'Large (500ml)', price: 119, oldPrice: 149 }
      ],
      price: 79, oldPrice: 99,
      desc: 'Rich cold brew coffee with milk and ice cream',
      bestseller: false, rating: 4.3, available: true
    },
    {
      id: 26, name: 'Virgin Mojito', cat: 'drinks', type: 'veg', emoji: '🍹',
      sizes: [
        { label: 'Regular (300ml)', price: 79, oldPrice: 99 },
        { label: 'Large (500ml)', price: 119, oldPrice: 149 }
      ],
      price: 79, oldPrice: 99,
      desc: 'Mint, lime, soda — refreshing and non-alcoholic',
      bestseller: false, rating: 4.5, available: true
    },
    // ── COMBOS ───────────────────────────────────────────────────────────────
    {
      id: 16, name: 'Party Pack', cat: 'combos', type: 'veg', emoji: '🎉',
      sizes: [
        { label: 'Standard', price: 599, oldPrice: 799 }
      ],
      price: 599, oldPrice: 799,
      desc: '2 Medium Pizzas + Garlic Bread + 2 Pepsi — Perfect for 2',
      bestseller: true, rating: 4.8, available: true
    },
    {
      id: 17, name: 'Family Feast', cat: 'combos', type: 'veg', emoji: '👨‍👩‍👧‍👦',
      sizes: [
        { label: 'Standard', price: 999, oldPrice: 1399 }
      ],
      price: 999, oldPrice: 1399,
      desc: '3 Large Pizzas + 2 Sides + 4 Drinks — Feeds 4-6 people',
      bestseller: false, rating: 4.7, available: true
    },
    {
      id: 27, name: 'Student Meal', cat: 'combos', type: 'veg', emoji: '🎓',
      sizes: [
        { label: 'Standard', price: 299, oldPrice: 399 }
      ],
      price: 299, oldPrice: 399,
      desc: '1 Medium Pizza + Garlic Bread + 1 Pepsi — Student-friendly deal!',
      bestseller: true, rating: 4.6, available: true
    },
    {
      id: 28, name: 'Non-Veg Party Pack', cat: 'combos', type: 'nonveg', emoji: '🍗',
      sizes: [
        { label: 'Standard', price: 799, oldPrice: 999 }
      ],
      price: 799, oldPrice: 999,
      desc: '2 Medium Non-Veg Pizzas + Crispy Wings + 2 Pepsi',
      bestseller: false, rating: 4.7, available: true
    }
  ],
  agents: [
    { id: 'AGT-001', name: 'Ravi Kumar', phone: '9811223344', status: 'busy', orders: 1, rating: 4.8, area: 'Saharanpur Rd' },
    { id: 'AGT-002', name: 'Amit Jha', phone: '9811223345', status: 'available', orders: 0, rating: 4.9, area: 'Rajpur Rd' },
    { id: 'AGT-003', name: 'Suresh Das', phone: '9811223346', status: 'busy', orders: 1, rating: 4.7, area: 'Clock Tower' },
    { id: 'AGT-004', name: 'Manoj Yadav', phone: '9811223347', status: 'available', orders: 0, rating: 4.6, area: 'Prem Nagar' },
  ],
  reviews: [
    { id: 'R1', name: 'Rahul S.', avatar: 'RS', stars: 5, text: 'Best pizza in Dehradun! The Pepperoni Feast is absolutely amazing. Delivery was on time and the tracking feature is so cool!', date: '2 days ago', menuItemId: 7 },
    { id: 'R2', name: 'Priya M.', avatar: 'PM', stars: 5, text: 'Paneer Tikka pizza is a must-try. The cheese burst crust is incredible. Will definitely order again!', date: '3 days ago', menuItemId: 2 },
    { id: 'R3', name: 'Arjun K.', avatar: 'AK', stars: 4, text: 'Great taste and fast delivery. The order tracking map is a great touch. Just like Dominos!', date: '5 days ago', menuItemId: 6 },
    { id: 'R4', name: 'Sneha R.', avatar: 'SR', stars: 5, text: 'Party Pack was perfect for our family night. Great value for money and everything was hot and fresh.', date: '1 week ago', menuItemId: 16 },
  ],
  promoCodes: {
    'PIZZA10': { discount: 10, type: 'percent', description: '10% off your order' },
    'PARTY20': { discount: 20, type: 'percent', description: '20% off your order' },
    'NEWUSER': { discount: 15, type: 'percent', description: '15% off for new users' },
    'DEHRADUN': { discount: 12, type: 'percent', description: '12% off for Dehradun locals' },
    'FLAT50':  { discount: 50, type: 'flat',    description: '₹50 flat off' }
  }
};

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    next();
  });
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', restaurant: 'Pizza Party Dehradun', version: '1.0.0' });
});

// ── AUTH ──────────────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !phone || !password) return res.status(400).json({ error: 'Name, phone and password required' });
  if (DB.users.find(u => u.phone === phone)) return res.status(409).json({ error: 'Phone already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, phone, email: email || null, password: hash, role: 'customer', createdAt: new Date().toISOString() };
  DB.users.push(user);
  const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;
  const user = DB.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = DB.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role });
});

// ── MENU ──────────────────────────────────────────────────────────────────────
app.get('/api/menu', (req, res) => {
  const { cat, type, bestseller, search } = req.query;
  let items = DB.menu.filter(m => m.available);
  if (cat) items = items.filter(m => m.cat === cat);
  if (type) items = items.filter(m => m.type === type);
  if (bestseller === 'true') items = items.filter(m => m.bestseller);
  if (search) items = items.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  res.json({ items, total: items.length });
});

app.get('/api/menu/:id', (req, res) => {
  const item = DB.menu.find(m => m.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

app.post('/api/menu', adminMiddleware, (req, res) => {
  const { name, cat, type, emoji, sizes, desc, bestseller } = req.body;
  if (!name || !cat || !type || !sizes || !desc) return res.status(400).json({ error: 'Missing required fields' });
  const item = {
    id: Math.max(...DB.menu.map(m => m.id)) + 1,
    name, cat, type, emoji: emoji || '🍕',
    sizes, price: sizes[1]?.price || sizes[0].price,
    oldPrice: sizes[1]?.oldPrice || sizes[0].oldPrice,
    desc, bestseller: bestseller || false,
    rating: 0, available: true
  };
  DB.menu.push(item);
  res.status(201).json(item);
});

app.put('/api/menu/:id', adminMiddleware, (req, res) => {
  const idx = DB.menu.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  DB.menu[idx] = { ...DB.menu[idx], ...req.body, id: DB.menu[idx].id };
  res.json(DB.menu[idx]);
});

app.delete('/api/menu/:id', adminMiddleware, (req, res) => {
  const idx = DB.menu.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  DB.menu[idx].available = false;
  res.json({ message: 'Item deactivated' });
});

// ── ORDERS ────────────────────────────────────────────────────────────────────
app.get('/api/orders', adminMiddleware, (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;
  let orders = [...DB.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status) orders = orders.filter(o => o.status === status);
  res.json({ orders: orders.slice(offset, offset + limit), total: orders.length });
});

app.get('/api/orders/my', authMiddleware, (req, res) => {
  const orders = DB.orders.filter(o => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders, total: orders.length });
});

app.get('/api/orders/:id', (req, res) => {
  const order = DB.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const { customer, phone, items, address, method, promoCode, userId } = req.body;
  if (!customer || !phone || !items?.length || !address) {
    return res.status(400).json({ error: 'customer, phone, items, address required' });
  }
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  let discount = 0;
  if (promoCode && DB.promoCodes[promoCode]) {
    const promo = DB.promoCodes[promoCode];
    discount = promo.type === 'percent' ? Math.round(subtotal * promo.discount / 100) : promo.discount;
  }
  const deliveryFee = (subtotal - discount) >= 399 ? 0 : 49;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + deliveryFee + tax;
  const year = new Date().getFullYear();
  const seq = Math.floor(8000 + Math.random() * 2000);
  const order = {
    id: `PP-${year}-${seq}`,
    userId: userId || null,
    customer, phone, items,
    subtotal, discount, deliveryFee, tax, total,
    status: 'received',
    payment: method === 'COD' ? 'pending' : 'paid',
    method: method || 'UPI',
    address,
    agentId: null, agentName: '—',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  DB.orders.push(order);
  res.status(201).json(order);
});

app.patch('/api/orders/:id/status', adminMiddleware, (req, res) => {
  const { status, agentId } = req.body;
  const order = DB.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const valid = ['received', 'preparing', 'otw', 'delivered', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (agentId) {
    const agent = DB.agents.find(a => a.id === agentId);
    if (agent) { order.agentId = agent.id; order.agentName = agent.name; }
  }
  res.json(order);
});

// ── PROMO CODES ───────────────────────────────────────────────────────────────
app.post('/api/promo/validate', (req, res) => {
  const { code, subtotal } = req.body;
  const promo = DB.promoCodes[code?.toUpperCase()];
  if (!promo) return res.status(404).json({ error: 'Invalid promo code' });
  const discount = promo.type === 'percent' ? Math.round(subtotal * promo.discount / 100) : promo.discount;
  res.json({ valid: true, code, ...promo, discountAmount: discount });
});

// ── AGENTS ────────────────────────────────────────────────────────────────────
app.get('/api/agents', adminMiddleware, (req, res) => {
  res.json({ agents: DB.agents });
});

app.patch('/api/agents/:id/status', adminMiddleware, (req, res) => {
  const agent = DB.agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  agent.status = req.body.status;
  res.json(agent);
});

// ── REVIEWS ───────────────────────────────────────────────────────────────────
app.get('/api/reviews', (req, res) => {
  const { menuItemId } = req.query;
  let reviews = DB.reviews;
  if (menuItemId) reviews = reviews.filter(r => r.menuItemId === parseInt(menuItemId));
  res.json({ reviews, total: reviews.length });
});

app.post('/api/reviews', authMiddleware, (req, res) => {
  const { menuItemId, stars, text } = req.body;
  if (!stars || !text) return res.status(400).json({ error: 'stars and text required' });
  const review = {
    id: uuidv4(),
    name: req.user.name,
    avatar: req.user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    stars, text, menuItemId: menuItemId || null,
    date: 'Just now', userId: req.user.id,
    createdAt: new Date().toISOString()
  };
  DB.reviews.push(review);
  res.status(201).json(review);
});

// ── ANALYTICS (admin) ─────────────────────────────────────────────────────────
app.get('/api/analytics', adminMiddleware, (req, res) => {
  const today = DB.orders.filter(o => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const revenue = today.reduce((sum, o) => sum + o.total, 0);
  const avgRating = DB.reviews.reduce((sum, r) => sum + r.stars, 0) / DB.reviews.length;
  res.json({
    todayOrders: today.length,
    todayRevenue: revenue,
    totalOrders: DB.orders.length,
    avgRating: avgRating.toFixed(1),
    avgDelivery: '28 min',
    ordersByStatus: {
      received: DB.orders.filter(o => o.status === 'received').length,
      preparing: DB.orders.filter(o => o.status === 'preparing').length,
      otw: DB.orders.filter(o => o.status === 'otw').length,
      delivered: DB.orders.filter(o => o.status === 'delivered').length
    },
    topItems: DB.menu
      .filter(m => m.bestseller)
      .map(m => ({ name: m.name, emoji: m.emoji, cat: m.cat }))
      .slice(0, 5)
  });
});

// ─── CATCH-ALL ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, () => {
  console.log(`🍕 Pizza Party Dehradun API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
