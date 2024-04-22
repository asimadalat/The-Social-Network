/**
 * A module to perform CRUD operations on replies based on URI endpoints.
 * @module routes/replies
 * @author Asim
 * @see models/* for ORM model definition files
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const db = require('../models');
const auth = require('../controllers/auth');
const {validateReply} = require('../controllers/validation');
const can = require('../permissions/replies');
const prefix = '/api/v1/posts/:postID([0-9]{1,})/comments/:commentID([0-9]{1,})/replies';
const router = Router({prefix: prefix});

router.get('/', getByComment);
router.post('/', bodyParser(), auth, validateReply, createReply);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), auth, validateReply, updateReply);
router.del('/:id([0-9]{1,})', auth, deleteReply);

/**
 * A function to retrieve replies by comment, sorted by most recent
 * @param {object} ctx - The Koa request/response
 * @returns {object} - Data requested by client with links to associated resources
 */
async function getByComment(ctx) {
  try {
    const {order="createdAt", direction='ASC'} = ctx.request.query;
    let result = await db.Replies.findAll({order: [[order, direction]], where: { commentID: ctx.params.commentID }});
    if (result.length) {
      const body = result.map(reply => {
        const {ID, allText, userID} = reply;

        const links = {
          likes: `${ctx.protocol}://${ctx.host}${prefix}/${reply.ID}/likes`,
          self: `${ctx.protocol}://${ctx.host}${prefix}/${reply.ID}`
        }

        return {ID, allText, userID, links};
      });
  
      ctx.status = 200;
      ctx.body = body;  
    } 
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to retrieve a reply by its ID
 * @param {object} ctx - The Koa request/response
 */
async function getById(ctx) {
  try {
    let reply = await db.Replies.findAll({ where: { ID: ctx.params.id } });
    ctx.status = 200;
    ctx.body = reply;  
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to create a new reply
 * @param {object} ctx - The Koa request/response
 */
async function createReply(ctx) {
  const body = ctx.request.body;
  body.postID = ctx.params.postID;
  body.commentID = ctx.params.commentID;
  try {
    let result = await db.Replies.create(body);
    ctx.status = 201;
    ctx.body = {ID: result.ID, updated: true, 
      link: `http://localhost:3000/api/v1/posts/${ctx.params.postID}/comments/${result.commentID}/replies/${result.ID}`}
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to update an existing reply
 * @param {object} ctx - The Koa request/response
 */
async function updateReply(ctx) {
  let reply = await db.Replies.findAll( { where: { ID: ctx.params.id } });
  const permission = can.update(ctx.state.user, reply[0].userID);
  console.log(permission);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const body = ctx.request.body;
    try {
      await db.Replies.update(body, { where: { ID: ctx.params.id } });
      result = await db.Replies.findAll( { where: { ID: ctx.params.id } });
      ctx.status = 200;
      ctx.body = {ID: result[0].ID, updated: true, 
        link: `http://localhost:3000/api/v1/posts/${ctx.params.postID}/comments/${result[0].commentID}/replies/${result[0].ID}`}
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * A function to delete an existing reply
 * @param {object} ctx - The Koa request/response
 */
async function deleteReply(ctx) {
  let reply = await db.Replies.findAll( { where: { ID: ctx.params.id } });
  const permission = can.delete(ctx.state.user, reply[0].userID);
  console.log(permission);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    try {
      await db.Replies.destroy( { where: { ID: ctx.params.id } });
      ctx.status = 200;
      ctx.body = "This reply has been deleted."
    } catch (e) {
      console.log(e);
    }
  }
}

/** Use router as export */
module.exports = router;