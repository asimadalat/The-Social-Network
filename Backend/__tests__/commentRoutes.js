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

describe('Post new comment', () => {
  it('should create a new comment', async () => {
    let res = await request(app.callback())
      .post('/api/v1/posts/1/comments')
      .send({
        allText: 'This is a test comment',
        imageURL: 'https://picsum.photos/id/237/200/300'
      })
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Post new comment while unauthenticated', () => {
  it('should not allow unauthenticated user to create a new comment', async () => {
    let res = await request(app.callback())
      .post('/api/v1/posts/1/comments')
      .send({
        allText: 'This is an unauthenicated test comment',
        imageURL: 'https://picsum.photos/id/237/200/300'
      })
    expect(res.statusCode).toEqual(401)
  })
});

describe('Get all comments by post', () => {
  it('should get the attributes of all comments on a post', async () => {
    res = await request(app.callback())
      .get('/api/v1/posts/4/comments')
    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
});

describe('Update existing comment as administrator', () => {
  it('should update existing comment not created by administrator', async () => {
    let res = await request(app.callback())
      .put('/api/v1/posts/3/comments/10')
      .send({
        allText: 'literally me'
      })
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Update existing comment as user', () => {
  it('should not allow updating existing comment not created by user', async () => {
    let res = await request(app.callback())
      .put('/api/v1/posts/3/comments/10')
      .send({
        allText: 'literally me'
      })
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Update existing comment while unauthenticated', () => {
  it('should not allow updating any existing comment while unauthenticated', async () => {
    let res = await request(app.callback())
      .put('/api/v1/posts/3/comments/10')
      .send({
        allText: 'literally me'
      })
    expect(res.statusCode).toEqual(401)
  })
});

describe('Get specified comment', () => {
  it('should get the attributes of a specified comment', async () => {
    res = await request(app.callback())
      .get('/api/v1/posts/3/comments/7')
    expect(res.statusCode).toEqual(200)
    expect(res.body[0]).toHaveProperty('ID', 7)
  })
});

describe('Delete specified comment as administrator', () => {
  it('should allow administrator to delete any specified comment', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/3/comments/10')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({})
  })
});

describe('Delete specified comment as user', () => {
  it('should not allow deletion of a specified comment not created by user', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/4/comments/8')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Delete specified comment while unauthenticated', () => {
  it('should not allow deletion of a specified comment while unauthenticated', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/3/comments/4')
    expect(res.statusCode).toEqual(401)
  })
});



