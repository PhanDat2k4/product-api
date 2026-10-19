require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check: 200 khi đã nối được MongoDB, 503 khi mất kết nối
app.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'error',
    mongodb: connected ? 'connected' : 'disconnected',
  });
});

app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Bắt lỗi chung (ví dụ JSON body sai cú pháp)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

connectDB()
  .then(() => Product.init()) // đợi tạo xong unique index của pid trước khi nhận request
  .then(() => {
    app.listen(PORT, () => console.log(`product-api listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Không kết nối được MongoDB:', err.message);
    process.exit(1);
  });
