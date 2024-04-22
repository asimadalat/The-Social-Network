const request = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken');

const assignToken = (user) => {
  return jwt.sign(
    { "UserMetaData": {
        "id": user["id"],
        "role": user["role"]
        }
      }, 
    process.env.JWT_SECRET_KEY, 
    { expiresIn: '30m'});
  };

const admin = { "id": 1, "role": "admin" };
const adminToken = assignToken(admin);

const user = { "id": 3, "role": "user" };
const userToken = assignToken(user);

describe('Get all logs as administrator', () => {
  it('should allow administrators to view all logs', async () => {
    res = await request(app.callback())
      .get('/api/v1/logs')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
});

describe('Get all logs as user', () => {
  it('should not allow users to view all logs', async () => {
    res = await request(app.callback())
      .get('/api/v1/logs')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Get all logs while unauthenticated', () => {
  it('should not allow unauthenticated users to view all logs', async () => {
    res = await request(app.callback())
      .get('/api/v1/logs')
    expect(res.statusCode).toEqual(401)
  })
});