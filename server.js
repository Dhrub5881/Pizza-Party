const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

// Order Schema
const OrderSchema = new mongoose.Schema({
  orderId: String,
  customerName: String,
  phone: String,
  address: String,
  items: Array,
  total: Number,
  status: { type: String, default: 'received' },
  paymentMethod: { type: String, default: 'cod' },
  createdAt: { type: Date, default: Date.now }
})
const Order = mongoose.model('Order', OrderSchema)

// Test - check if API is running
app.get('/', (req, res) => {
  res.json({ message: '🍕 Pizza Party API running!', status: 'ok' })
})

// Place new order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, phone, address, items, total, paymentMethod } = req.body
    const year = new Date().getFullYear()
    const orderId = `PP-${year}-${Math.floor(8000 + Math.random() * 2000)}`
    const order = await Order.create({ orderId, customerName, phone, address, items, total, paymentMethod })
    res.json({ success: true, orderId: order.orderId, _id: order._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all orders (for admin panel)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update order status (admin)
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Connect MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB PizzaParty connected!')
    app.listen(process.env.PORT || 5000, () => {
      console.log('🍕 Pizza Party server running!')
    })
  })
  .catch(err => console.log('❌ Error:', err))
