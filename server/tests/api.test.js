// Automated API testing / integration tests
// Writing unit tests
const request = require('supertest');
const express = require('express');

// Dummy app for testing HTTP status codes used correctly and Server-side error handling
const app = express();
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api/error', (req, res, next) => next(new Error('Test error')));
app.use((err, req, res, next) => res.status(500).json({ error: 'Server error' }));

describe('API Integration Tests', () => {
  it('should return 200 on health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
  });

  it('should handle server-side errors returning 500', async () => {
    const res = await request(app).get('/api/error');
    expect(res.statusCode).toEqual(500);
  });
});
