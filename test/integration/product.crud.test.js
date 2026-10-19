const test = require('node:test');
const assert = require('node:assert/strict');

// Integration test: cần API đang chạy (và đã nối MongoDB)
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const pid = Date.now();

async function call(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // response không có body JSON
  }
  return { status: res.status, data };
}

test('GET /health trả 200', async () => {
  const { status, data } = await call('GET', '/health');
  assert.equal(status, 200);
  assert.equal(data.mongodb, 'connected');
});

test('POST tạo sản phẩm', async () => {
  const { status, data } = await call('POST', '/api/products', {
    pid, pname: 'Laptop', price: 1500, quantity: 10,
  });
  assert.equal(status, 201);
  assert.equal(data.pid, pid);
});

test('POST trùng pid trả 409', async () => {
  const { status } = await call('POST', '/api/products', {
    pid, pname: 'Trung', price: 1, quantity: 1,
  });
  assert.equal(status, 409);
});

test('POST price âm trả 400', async () => {
  const { status } = await call('POST', '/api/products', {
    pid: pid + 1, pname: 'Sai', price: -5, quantity: 1,
  });
  assert.equal(status, 400);
});

test('GET danh sách có sản phẩm vừa tạo', async () => {
  const { status, data } = await call('GET', '/api/products');
  assert.equal(status, 200);
  assert.ok(data.some((p) => p.pid === pid));
});

test('GET theo pid', async () => {
  const { status, data } = await call('GET', `/api/products/${pid}`);
  assert.equal(status, 200);
  assert.equal(data.pname, 'Laptop');
});

test('PUT cập nhật giá và số lượng', async () => {
  const { status, data } = await call('PUT', `/api/products/${pid}`, {
    price: 1200, quantity: 8,
  });
  assert.equal(status, 200);
  assert.equal(data.price, 1200);
  assert.equal(data.quantity, 8);
});

test('DELETE xóa sản phẩm', async () => {
  const { status } = await call('DELETE', `/api/products/${pid}`);
  assert.equal(status, 200);
});

test('GET sau khi xóa trả 404', async () => {
  const { status } = await call('GET', `/api/products/${pid}`);
  assert.equal(status, 404);
});
