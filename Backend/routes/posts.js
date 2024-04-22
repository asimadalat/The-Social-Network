/**
 * A module to perform CRUD operations on posts based on URI endpoints.
 * @module routes/posts
 * @author Asim
 * @see models/* for ORM model definition files
 */

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const db = require('../models');
const auth = require('../controllers/auth');
const {validatePost} = require('../controllers/validation');
const can = require('../permissions/posts');
const prefix = '/api/v1/posts';
const router = Router({prefix: prefix});

router.get('/', getAll);
router.post('/', bodyParser(), auth, validatePost, createPost);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), auth, validatePost, updatePost);
router.del('/:id([0-9]{1,})', auth, deletePost);

router.get('/:id([0-9]{1,})/views', viewCount);

router.get('/:id([0-9]{1,})/likes', likeCount);
router.post('/:id([0-9]{1,})/:userId([0-9]{1,})/likes', auth, likePost);
router.del('/:id([0-9]{1,})/:userId([0-9]{1,})/likes', auth, removeLike);

/**
 * A function to retrieve all posts, sorted by most recent
 * @param {object} ctx - The Koa request/response
 * @returns {object} - Data requested by client with links to associated resources
 */
async function getAll(ctx) {
  try {
    const {order="createdAt", direction='DESC'} = ctx.request.query;
    let result = await db.Posts.findAll({order: [[order, direction]]});
    if (result.length) {
      const body = result.map(post => {
        const {ID, title, bodyText, imageURL, userID} = post;

        const links = {
          likes: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/likes`,
          views: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/views`,
          self: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}`
        }

        return {ID, title, bodyText, imageURL, userID, links};
      });
  
      ctx.status = 200;
      ctx.body = body;  
    } 
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to retrieve a post by its ID
 * @param {object} ctx - The Koa request/response
 */
async function getById(ctx) {
  try {
    let result = await db.Posts.findAll({ where: { ID: ctx.params.id } });
    if (result.length) {
      await db.PostViews.increment('viewCount', { by: 1, where: {postID: ctx.params.id} });

      const post = result[0];
      const {ID, title, bodyText, imageURL, userID} = post;
      const links = {
        likes: `${ctx.protocol}://${ctx.host}${prefix}/${ctx.params.id}/likes`,
        views: `${ctx.protocol}://${ctx.host}${prefix}/${ctx.params.id}/views`,
        self: `${ctx.protocol}://${ctx.host}${prefix}/${ctx.params.id}`
      };
      
      ctx.status = 200;
      ctx.body = {ID, title, bodyText, imageURL, userID, links};
    }
    //ctx.body = post;  
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to create a new post
 * @param {object} ctx - The Koa request/response
 */
async function createPost(ctx) {
  const body = ctx.request.body;
  try {
    let result = await db.Posts.create(body);
    await db.PostViews.create({postID: result.ID, viewCount: 0});
    ctx.status = 201;
    ctx.body = {ID: result.ID, updated: true, link: `http://localhost:3000/api/v1/posts/${result.ID}`}
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to update an existing post
 * @param {object} ctx - The Koa request/response
 */
async function updatePost(ctx) {
  let post = await db.Posts.findAll( { where: { ID: ctx.params.id } });
  const permission = can.update(ctx.state.user, post[0].userID);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const body = ctx.request.body;
    try {
      await db.Posts.update(body, { where: { ID: ctx.params.id } });
      result = await db.Comments.findAll( { where: { ID: ctx.params.id } });
      ctx.status = 200;
      ctx.body = {ID: result[0].ID, updated: true, link: `http://localhost:3000/api/v1/posts/${result[0].ID}`}
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * A function to delete an existing post
 * @param {object} ctx - The Koa request/response
 */
async function deletePost(ctx) {
  let post = await db.Posts.findAll( { where: { ID: ctx.params.id } });
  const permission = can.update(ctx.state.user, post[0].userID);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    try {
      await db.Replies.destroy( { where: { postID: ctx.params.id } });
      await db.PostViews.destroy( { where: { postID: ctx.params.id } });
      await db.PostLikes.destroy( { where: { postID: ctx.params.id } });
      await db.Comments.destroy( { where: { postID: ctx.params.id } });
      await db.Posts.destroy( { where: { ID: ctx.params.id } });
      ctx.status = 200;
      ctx.body = "This post has been deleted."
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * A function to retrieve the view count for a given post
 * @param {object} ctx - The Koa request/response
 */
async function viewCount(ctx) {
  try {
    const result = await db.PostViews.findOne( { attributes: ['viewCount'], where: { postID: ctx.params.id } } );
    result.viewCount = result.viewCount/2
    ctx.status = 200;
    ctx.body = result;
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to retrieve the like count for a given post
 * @param {object} ctx - The Koa request/response
 */
async function likeCount(ctx) {
  try {
    const result = await db.PostLikes.count( { where: { postID: ctx.params.id } } );
    ctx.status = 200;
    ctx.body = result ? result : 0;
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to like a post
 * @param {object} ctx - The Koa request/response
 */
async function likePost(ctx) {
  try {
    const postId = parseInt(ctx.params.id);
    const userId = parseInt(ctx.params.userId);
    const result = await db.PostLikes.findOne( { where: { postID: postId, userID: userId } });
    if (result !== null) {
      ctx.status = 409;
      ctx.body = "Cannot like twice.";
    } else {
      await db.PostLikes.create({postID: postId, userID: userId});
      ctx.status = 201;
      ctx.body = "Liked.";
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * A function to remove the like from a liked post
 * @param {object} ctx - The Koa request/response
 */
async function removeLike(ctx) {
  try {
    const postId = parseInt(ctx.params.id);
    const userId = parseInt(ctx.params.userId);
    const result = await db.PostLikes.findOne( { where: { postID: postId, userID: userId } });
    if (result !== null) {
      await db.PostLikes.destroy({ where: {postID: postId, userID: userId} });
      ctx.status = 200;
      ctx.body = "Removed like.";
    } else {
      ctx.status = 409;
      ctx.body = "No like to remove.";
    }
  } catch (e) {
    console.log(e);
  }
}

/** Use router as export */
module.exports = router;

