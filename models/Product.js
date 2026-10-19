const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    pid: { type: Number, required: true, unique: true },
    pname: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

// Ẩn _id của MongoDB khi trả JSON, vì đã có pid làm khóa nghiệp vụ
productSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Product', productSchema);
