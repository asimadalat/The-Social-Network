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

describe('Post new post', () => {
  it('should create a new post', async () => {
    let res = await request(app.callback())
      .post('/api/v1/posts')
      .send({
        title: 'My new post',
        bodyText: 'Welcome to my new post!'
      })
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Post new post while unauthenticated', () => {
  it('should not allow unauthenticated user to create a new post', async () => {
    let res = await request(app.callback())
      .post('/api/v1/posts')
      .send({
        title: 'My new unauthenticated post',
        bodyText: 'Welcome to my new post!'
      })
    expect(res.statusCode).toEqual(401)
  })
});

describe('Get all posts', () => {
  it('should get the attributes of all posts', async () => {
    res = await request(app.callback())
      .get('/api/v1/posts')
    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
});

describe('Update existing post as administrator', () => {
  it('should update existing post not created by administrator', async () => {
    let res = await request(app.callback())
      .put('/api/v1/posts/3')
      .send({
        title: 'hello!',
        bodyText: 'hello world'
      })
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Update existing post as user', () => {
  it('should not allow updating existing post not created by user', async () => {
    let res = await request(app.callback())
      .put('/api/v1/posts/1')
      .send({
        title: 'post numero trio',
        bodyText: 'The Third Post Ever.'
      })
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Update existing post while unauthenticated', () => {
  it('should not allow unauthenticated user to update any post', async () => {
    let res = await request(app.callback())
      .put('/api/v1/posts/1')
      .send({
        title: 'post numero trio',
        bodyText: 'The Third Post Ever.'
      })
    expect(res.statusCode).toEqual(401)
  })
});

describe('Get specified post', () => {
  it('should get the attributes of a specified post', async () => {
    res = await request(app.callback())
      .get('/api/v1/posts/2')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('ID', 2)
  })
});

describe('Delete specified post as administrator', () => {
  it('should allow administrator to delete any specified post', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/20')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({})
  })
});

describe('Delete specified post as user', () => {
  it('should not allow deletion of a specified post not created by user', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/4')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(403)
  })
});

describe('Delete specified post while unauthenticated', () => {
  it('should not allow deletion of a specified post while unauthenticated', async () => {
    res = await request(app.callback())
      .delete('/api/v1/posts/1')
    expect(res.statusCode).toEqual(401)
  })
});

describe('Get post view count', () => {
  it('should get the views of a specified post', async () => {
    let res = await request(app.callback())
      .get('/api/v1/posts/1/views')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('viewCount')
  })
});

describe('Get post like count', () => {
  it('should get the likes of a specified post', async () => {
    let res = await request(app.callback())
      .get('/api/v1/posts/1/likes')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(expect.any(Number));
  })
});

describe('Post like on existing post', () => {
  it('should create a new post like resource', async () => {
    let res = await request(app.callback())
      .post('/api/v1/posts/1/11/likes')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(201)
    expect(res.body).toEqual({})
  })
});

describe('Remove like on existing post', () => {
  it('should delete an existing post like resource', async () => {
    let res = await request(app.callback())
      .del('/api/v1/posts/1/11/likes')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({})
  })
});


