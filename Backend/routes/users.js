/**
 * A module to perform CRUD operations on users based on URI endpoints.
 * @module routes/users
 * @author Asim
 * @see models/* for ORM model definition files
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const db = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const auth = require('../controllers/auth');
const jwt = require('jsonwebtoken');
const {validateUser} = require('../controllers/validation');
const can = require('../permissions/users');
const prefix = '/api/v1/users';
const router = Router({prefix: prefix});

router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', getUserById);
router.get('/:id([0-9]{1,})/full', auth, getFullUserById);
router.put('/:id([0-9]{1,})', bodyParser(), auth, validateUser, updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);

router.post('/login', bodyParser(), login);

/**
 * A function to retrieve all users
 * @param {object} ctx - The Koa request/response
 */
async function getAll(ctx) {
  console.log(ctx.state.user);
  const permission = can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    try {
      let users = await db.Users.findAll();
      ctx.status = 200;
      ctx.body = users;  
    } catch (e) {
      console.log(e);
    }  
  }
}

/**
 * A function to retrieve a user by its ID
 * @param {object} ctx - The Koa request/response
 */
async function getUserById(ctx) {
  try {
    let user = await db.Users.findAll({ where: { ID: ctx.params.id } });
    if (user.length) {
      hideUser = {
        ID: user[0].ID,
        name: user[0].name,
        username: user[0].username,
        bio: user[0].bio,
        avatarURL: user[0].avatarURL
      }
      ctx.status = 200;
      ctx.body = hideUser;  
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * An administrator function to retrieve a full user by its ID
 * @param {object} ctx - The Koa request/response
 */
async function getFullUserById(ctx) {
  const permission = can.read(ctx.state.user, ctx.params);
  let user = await db.Users.findAll({ where: { ID: ctx.params.id } });
  if (permission.granted) {
    try {
      hideUser = {
        ID: user[0].ID,
        role: user[0].role,
        name: user[0].name,
        username: user[0].username,
        bio: user[0].bio,
        email: user[0].email,
        avatarURL: user[0].avatarURL
      }
      ctx.status = 200;
      ctx.body = hideUser;  
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * A function to create a new user
 * @param {object} ctx - The Koa request/response
 */
async function createUser(ctx) {
  console.log("USEER");
  const user = ctx.request.body;
  user.password = await bcrypt.hash(user.password, saltRounds);
  splitPass = user.password.split('$');
  user.passwordSalt = splitPass[3].substring(0, 22);
  try {
    let result = await db.Users.create(user);
    console.log("USEER2");
    ctx.status = 201;
    ctx.body = {ID: result.ID, updated: true, link: `http://localhost:3000/api/v1/users/${result.ID}`}
    await db.Logs.create({ timestamp: Date.now().toString(), logData: `User [${result.ID}] account created` })
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to update an existing user
 * @param {object} ctx - The Koa request/response
 */
async function updateUser(ctx) {
  const permission = can.update(ctx.state.user, ctx.params);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const user = ctx.request.body;
    user.password = await bcrypt.hash(user.password, saltRounds);
    splitPass = user.password.split('$');
    user.passwordSalt = splitPass[3].substring(0, 22);
    try {
      await db.Users.update(user, { where: { ID: ctx.params.id } });
      result = await db.Users.findAll( { where: { ID: ctx.params.id } });
      ctx.status = 200;
      ctx.body = {ID: result[0].ID, updated: true, link: `http://localhost:3000/api/v1/users/${result[0].ID}`}
      await db.Logs.create({ timestamp: Date.now().toString(), logData: `User [${result[0].ID}] account updated` })
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * A function to delete an existing user
 * @param {object} ctx - The Koa request/response
 */
async function deleteUser(ctx) {
  const permission = can.delete(ctx.state.user, ctx.params);
  console.log(permission);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    try {
      await db.Posts.update( { userID: null }, { where: { userID: ctx.params.id } });
      await db.Comments.update( { userID: null }, { where: { userID: ctx.params.id } });
      await db.Replies.update( { userID: null }, { where: { userID: ctx.params.id } });
      await db.Users.destroy( { where: { ID: ctx.params.id } });
      ctx.status = 200;
      ctx.body = "This user has been deleted."
      await db.Logs.create({ timestamp: Date.now().toString(), logData: `User [${ctx.params.id}] account deleted`})
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * A function to login as an existing user
 * @param {object} ctx - The Koa request/response
 */
async function login(ctx) {
  const user = ctx.request.body;
  try {
    result = await db.Users.findAll({ where: { username: user.username} });;
  } catch (error) {
    console.error(`${Date.now().toString()}   User [${user.username}] authentication error: ${error}`);
  }

  if (result.length) {
    const selectedUser = result[0];
    if (await bcrypt.compare(user.password, selectedUser.password)) {
      const {ID, username, email, avatarURL, password} = selectedUser;
      const token = jwt.sign(
        { "UserMetaData": {
          "id": selectedUser.ID,
          "role": selectedUser.role
          }
        }, 
        process.env.JWT_SECRET_KEY, 
        { expiresIn: '30m'})
      const links = {
        self: `${ctx.protocol}://${ctx.host}${prefix}/${ID}`
      }
      ctx.status = 200;
      ctx.body = {ID, username, email, avatarURL, links, password, token};
      await db.Logs.create({ timestamp: Date.now().toString(), logData: `User [${selectedUser.ID}] authenticated`})
    } else {
      await db.Logs.create({ timestamp: Date.now().toString(), logData: `User [${selectedUser.ID}] login failure: incorrect password`})
    }
  } else {
    await db.Logs.create({ timestamp: Date.now().toString(), logData: `User [${user.username}] not found`})
  }
}
  



/** Use router as export */
module.exports = router;