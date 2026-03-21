# 🍕 Pizza Party Dehradun — Full Stack Web App

> **Live at:** Saharanpur Rd, Dehradun | 📍 [Google Maps](https://maps.app.goo.gl/AmpmAXjQJAMkSgg28)

A complete pizza ordering web application with frontend + REST API backend. Includes full menu with size selection, cart, order tracking, admin panel, and more.

---

## 📦 Project Structure

```
pizza-party/
├── frontend/
│   └── index.html          # Complete single-file frontend (no build needed)
├── backend/
│   ├── src/
│   │   └── server.js       # Express REST API server
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start          # production
# or
npm run dev        # development with auto-reload (nodemon)
```

API runs on **http://localhost:3001**

### Frontend

```bash
cd frontend
# Just open index.html in your browser, or serve it:
npx serve .
# or
python3 -m http.server 8080
```

Frontend runs on **http://localhost:8080**

---

## 🔌 API Endpoints

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (auth required) |

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items (supports `?cat=pizza&type=veg&bestseller=true&search=paneer`) |
| GET | `/api/menu/:id` | Get single item |
| POST | `/api/menu` | Add item (admin) |
| PUT | `/api/menu/:id` | Update item (admin) |
| DELETE | `/api/menu/:id` | Deactivate item (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | All orders (admin) |
| GET | `/api/orders/my` | My orders (auth) |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Place order |
| PATCH | `/api/orders/:id/status` | Update status (admin) |

### Promo Codes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/promo/validate` | Validate a promo code |

### Agents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | All delivery agents (admin) |
| PATCH | `/api/agents/:id/status` | Update agent status (admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | All reviews |
| POST | `/api/reviews` | Submit review (auth) |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Dashboard stats (admin) |

---

## 🍕 Menu — All Items & Sizes

### Veg Pizzas
| Item | Small (7") | Medium (10") | Large (12") | XL (14") |
|------|-----------|--------------|-------------|----------|
| Margherita Classic | ₹149 | ₹199 | ₹279 | ₹349 |
| Paneer Tikka Special ⭐ | ₹199 | ₹299 | ₹379 | ₹459 |
| Farm House | ₹179 | ₹279 | ₹359 | ₹439 |
| Double Cheese | ₹159 | ₹259 | ₹339 | ₹419 |
| Veggie Supreme | ₹219 | ₹319 | ₹399 | ₹479 |
| Cheese & Corn Delight | ₹169 | ₹269 | ₹349 | ₹429 |

### Non-Veg Pizzas
| Item | Small (7") | Medium (10") | Large (12") | XL (14") |
|------|-----------|--------------|-------------|----------|
| Chicken BBQ ⭐ | ₹249 | ₹349 | ₹449 | ₹549 |
| Pepperoni Feast ⭐ | ₹279 | ₹379 | ₹479 | ₹579 |
| Chicken Tikka | ₹259 | ₹359 | ₹459 | ₹559 |
| Mutton Keema Special | ₹299 | ₹399 | ₹499 | ₹599 |
| Double Chicken Loaded | ₹279 | ₹389 | ₹489 | ₹589 |

### Sides
| Item | Size 1 | Size 2 |
|------|--------|--------|
| Garlic Breadsticks ⭐ | 4 pcs ₹79 | 8 pcs ₹99 |
| Crispy Wings | 4 pcs ₹99 | 8 pcs ₹179 |
| Caesar Salad | Regular ₹139 | — |
| Loaded Fries | Regular ₹79 | Large ₹119 |
| Paneer Bites | 6 pcs ₹99 | 12 pcs ₹179 |
| Choco Lava Cake ⭐ | Single ₹79 | Double ₹139 |

### Drinks
| Item | Size 1 | Size 2 | Size 3 |
|------|--------|--------|--------|
| Pepsi | 250ml ₹35 | 500ml ₹49 | 1.25L ₹89 |
| Mango Smoothie ⭐ | 300ml ₹89 | 500ml ₹129 | — |
| Lemonade | 300ml ₹59 | 500ml ₹89 | — |
| Cold Coffee | 300ml ₹79 | 500ml ₹119 | — |
| Virgin Mojito | 300ml ₹79 | 500ml ₹119 | — |

### Combos
| Item | Price |
|------|-------|
| Party Pack ⭐ (2 Med Pizzas + Garlic Bread + 2 Pepsi) | ₹599 |
| Family Feast (3 Large Pizzas + 2 Sides + 4 Drinks) | ₹999 |
| Student Meal ⭐ (1 Med Pizza + Garlic Bread + 1 Pepsi) | ₹299 |
| Non-Veg Party Pack (2 Med NV Pizzas + Wings + 2 Pepsi) | ₹799 |

---

## 🎟 Promo Codes
| Code | Discount |
|------|----------|
| PIZZA10 | 10% off |
| PARTY20 | 20% off |
| NEWUSER | 15% off |
| DEHRADUN | 12% off |
| FLAT50 | ₹50 flat off |

---

## 🔧 Environment Variables

```env
PORT=3001
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## 🛠 Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS — no framework, no build step
- **Backend:** Node.js + Express.js
- **Auth:** JWT (JSON Web Tokens)
- **Storage:** In-memory (swap `DB` object in `server.js` for MongoDB/PostgreSQL)

---

## 📍 Restaurant Info

**Pizza Party**  
GF, Saharanpur Road, Dehradun, Uttarakhand  
📞 Contact via Google Maps listing  
🕐 Open: 11 AM – 11 PM, All days  
⭐ Rating: 4.7/5  
