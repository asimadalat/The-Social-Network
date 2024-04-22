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

const user = { "id": 3, "role": "user" };
const userToken = assignToken(user);

const admin = { "id": 1, "role": "admin" };
const adminToken = assignToken(admin);

describe('Post new user', () => {
  it('should create a new user', async () => {
    let res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: 'Charged11Warrior',
        password: 'password'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Get all users as administrator', () => {
  it('should allow administrator to get the attributes of all users', async () => {
    res = await request(app.callback())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
});

describe('Get all users as user', () => {
  it('should not allow user to get the attributes of all users', async () => {
    res = await request(app.callback())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Update existing user as administrator', () => {
it('should update existing user not created by administrator', async () => {
  let res = await request(app.callback())
    .put('/api/v1/users/11')
    .send({
      username: 'desmond4',
      password: 'password'
    })
    .set('Authorization', `Bearer ${adminToken}`)
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Update existing user as user', () => {
  it('should not allow updating existing user not created by user', async () => {
    let res = await request(app.callback())
      .put('/api/v1/users/11')
      .send({
        username: 'desmond5',
        password: 'password'
      })
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Update existing user while unauthenticated', () => {
  it('should not allow updating existing user while unauthenticated', async () => {
    let res = await request(app.callback())
      .put('/api/v1/users/11')
      .send({
        username: 'desmond6notauth',
        password: 'password'
      })
    expect(res.statusCode).toEqual(401)
  })
});

describe('Get specific user', () => {
  it('should get the attributes of a specified user', async () => {
    res = await request(app.callback())
      .get('/api/v1/users/13')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('ID', 13)
  })
});

describe('Get specific user full record as administrator', () => {
  it('should get the full record of a specified user as administrator', async () => {
    res = await request(app.callback())
      .get('/api/v1/users/13/full')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('ID', 13)
  })
});

describe('Get specific user full record as user', () => {
  it('should not get the full record of a specified user as user', async () => {
    res = await request(app.callback())
      .get('/api/v1/users/13/full')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(404)
  })
});

describe('Delete specific user as administrator', () => {
  it('should allow administrator to delete any specified user', async () => {
    res = await request(app.callback())
      .delete('/api/v1/users/6')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({})
  })
});

describe('Delete specific user as user', () => {
  it('should not allow user to delete any account except their own', async () => {
    res = await request(app.callback())
      .delete('/api/v1/users/8')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Delete specific user while unauthenticated', () => {
  it('should not allow unauthenticated user to delete any specified user', async () => {
    res = await request(app.callback())
      .delete('/api/v1/users/8')
    expect(res.statusCode).toEqual(401)
  })
});

describe('Login as existing user', () => {
  it('should login as an existing user', async () => {
    let res = await request(app.callback())
      .post('/api/v1/users/login')
      .send({
        username: 'rachael',
        password: 'pass'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('ID', 3)
  })
});




  

  
