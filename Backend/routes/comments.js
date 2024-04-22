/**
 * A module to perform CRUD operations on comments based on URI endpoints.
 * @module routes/comments
 * @author Asim
 * @see models/* for ORM model definition files
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const db = require('../models');
const auth = require('../controllers/auth');
const {validateComment} = require('../controllers/validation');
const can = require('../permissions/comments');
const prefix = '/api/v1/posts/:postID([0-9]{1,})/comments';
const router = Router({prefix: prefix});

router.get('/', getByPost);
router.post('/', bodyParser(), auth, validateComment, createComment);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), auth, validateComment, updateComment);
router.del('/:id([0-9]{1,})', auth, deleteComment);

/**
 * A function to retrieve comments by post, sorted by most recent
 * @param {object} ctx - The Koa request/response
 * @returns {object} - Data requested by client with links to associated resources
 */
async function getByPost(ctx) {
  try {
    const {order="createdAt", direction='DESC'} = ctx.request.query;
    let result = await db.Comments.findAll({order: [[order, direction]], where: { postID: ctx.params.postID }});
    if (result.length) {
      const body = result.map(comment => {
        const {ID, allText, imageURL, userID} = comment;

        const links = {
          likes: `${ctx.protocol}://${ctx.host}/api/v1/posts/${ctx.params.postID}/comments/${comment.ID}/likes`,
          self: `${ctx.protocol}://${ctx.host}/api/v1/posts/${ctx.params.postID}/comments/${comment.ID}`
        }

        return {ID, allText, imageURL, userID, links};
      });
      ctx.status = 200;
      ctx.body = body;  
    } 
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to retrieve a comment by its ID
 * @param {object} ctx - The Koa request/response
 */
async function getById(ctx) {
  try {
    let comment = await db.Comments.findAll({ where: { ID: ctx.params.id } });
    ctx.status = 200;
    ctx.body = comment;  
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to create a new comment
 * @param {object} ctx - The Koa request/response
 */
async function createComment(ctx) {
  const body = ctx.request.body;
  body.postID = ctx.params.postID;
  try {
    let result = await db.Comments.create(body);
    ctx.status = 201;
    ctx.body = {ID: result.ID, updated: true, link: `http://localhost:3000/api/v1/posts/${ctx.params.postID}/comments/${result.ID}`}
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to update an existing comment
 * @param {object} ctx - The Koa request/response
 */
async function updateComment(ctx) {
  let comment = await db.Comments.findAll( { where: { ID: ctx.params.id } });
  const permission = can.update(ctx.state.user, comment[0].userID);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const body = ctx.request.body;
    try {
      await db.Comments.update(body, { where: { ID: ctx.params.id } });
      result = await db.Comments.findAll( { where: { ID: ctx.params.id } });
      ctx.status = 200;
      ctx.body = {ID: result[0].ID, updated: true, link: `http://localhost:3000/api/v1/posts/${ctx.params.postID}/comments/${result[0].ID}`}
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * A function to delete an existing comment
 * @param {object} ctx - The Koa request/response
 */
async function deleteComment(ctx) {
  let comment = await db.Comments.findAll( { where: { ID: ctx.params.id } });
  const permission = can.delete(ctx.state.user, comment[0].userID);
  console.log(permission);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    try {
      await db.Replies.destroy( { where: { commentID: ctx.params.id } });
      await db.Comments.destroy( { where: { ID: ctx.params.id } });
      ctx.status = 200;
      ctx.body = "This comment has been deleted."
    } catch (e) {
      console.log(e);
    }
  }
}

/** Use router as export */
module.exports = router;

