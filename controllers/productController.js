const Product = require('../models/Product');

function handleError(res, err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'pid đã tồn tại' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
}

// CREATE: POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body ?? {});
    res.status(201).json(product);
  } catch (err) {
    handleError(res, err);
  }
};

// READ ALL: GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ pid: 1 });
    res.json(products);
  } catch (err) {
    handleError(res, err);
  }
};

// READ ONE: GET /api/products/:pid
exports.getProductByPid = async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    handleError(res, err);
  }
};

// UPDATE: PUT /api/products/:pid  (không cho đổi pid)
exports.updateProduct = async (req, res) => {
  try {
    const { pid, ...changes } = req.body ?? {};
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      changes,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE: DELETE /api/products/:pid
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted', product });
  } catch (err) {
    handleError(res, err);
  }
};
