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

describe('Post new reply', () => {
  it('should create a new reply', async () => {
    let res = await request(app.callback())
      .post('/api/v1/posts/2/comments/3/replies')
      .send({
        allText: 'ikr'
      })
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Post new reply while unauthenticated', () => {
  it('should not allow unauthenticated user to create a new reply', async () => {
    let res = await request(app.callback())
      .post('/api/v1/posts/3/comments/10/replies')
      .send({
        allText: 'ikr'
      })
    expect(res.statusCode).toEqual(401)
  })
});

describe('Get all replies by comment', () => {
  it('should get the attributes of all replies on a comment', async () => {
    res = await request(app.callback())
      .get('/api/v1/posts/3/comments/4/replies')
    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
});

describe('Update existing reply as administrator', () => {
it('should update an existing reply not created by administrator', async () => {
  let res = await request(app.callback())
    .put('/api/v1/posts/3/comments/4/replies/1')
    .send({
      allText: 'theres no method'
    })
    .set('Authorization', `Bearer ${adminToken}`)
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Update existing reply as user', () => {
  it('should not allow updating existing reply not created by user', async () => {
    let res = await request(app.callback())
      .put('/api/v1/posts/3/comments/4/replies/2')
      .send({
        allText: 'Great observation.'
      })
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});
  
describe('Update existing reply while unauthenticated', () => {
  it('should not allow updating existing reply while unauthenticated', async () => {
    let res = await request(app.callback())
      .put('/api/v1/posts/3/comments/4/replies/1')
      .send({
        allText: 'theres no methods'
      })
    expect(res.statusCode).toEqual(401)
  })
});

describe('Get specified reply', () => {
  it('should get the attributes of a specified reply', async () => {
    res = await request(app.callback())
      .get('/api/v1/posts/3/comments/4/replies/3')
    expect(res.statusCode).toEqual(200)
    expect(res.body[0]).toHaveProperty('ID', 3)
  })
});

describe('Delete specific reply', () => {
  it('should delete a specified reply', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/3/comments/4/replies/4')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({})
  })
});

describe('Delete specified reply as administrator', () => {
  it('should allow administrator to delete any specified reply', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/3/comments/4/replies/3')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({})
  })
});

describe('Delete specified reply as user', () => {
  it('should not allow deletion of a specified reply not created by user', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/3/comments/4/replies/2')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Delete specified reply while unauthenticated', () => {
  it('should not allow deletion of a specified reply while unauthenticated', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/3/comments/4/replies/2')
    expect(res.statusCode).toEqual(401)
  })
});


