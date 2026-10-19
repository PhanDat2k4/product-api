const test = require('node:test');
const assert = require('node:assert/strict');
const Product = require('../../models/Product');

// Unit test: chỉ kiểm tra schema, KHÔNG cần MongoDB

test('sản phẩm hợp lệ thì validate thành công', () => {
  const p = new Product({ pid: 1, pname: 'Laptop', price: 1000, quantity: 5 });
  assert.equal(p.validateSync(), undefined);
});

test('thiếu pname thì báo lỗi', () => {
  const err = new Product({ pid: 1, price: 1000, quantity: 5 }).validateSync();
  assert.ok(err.errors.pname);
});

test('price âm thì báo lỗi', () => {
  const err = new Product({ pid: 1, pname: 'A', price: -1, quantity: 5 }).validateSync();
  assert.ok(err.errors.price);
});

test('quantity âm thì báo lỗi', () => {
  const err = new Product({ pid: 1, pname: 'A', price: 10, quantity: -5 }).validateSync();
  assert.ok(err.errors.quantity);
});
