/**
 * A module to perform validation checks on request/response data using JSON schema.
 * @module controllers/validation
 * @author Asim
 * @see schemas/* for JSON Schema definition files
 */

const {Validator, ValidationError} = require('jsonschema');
const postSchema = require('../schemas/post.json').definitions.post;
const userSchema = require('../schemas/user.json').definitions.user;
const commentSchema = require('../schemas/comment.json').definitions.comment;
const replySchema = require('../schemas/reply.json').definitions.reply;

const v = new Validator();


/**
 * Wrapper that matches correct validator to correct schema
 * @param {object} schema - Resource schema definition, JSON format e.g user
 * @param {string} resource - Resource name e.g. 'comment'
 * @returns {function} - Koa middleware handler taking (ctx, next) params
 */
const makeKoaValidator = schema => {

    /**
     * Koa async middleware handler function for validation
     * @param {object} ctx - The Koa request/response
     * @param {function} next - The Koa next callback
     * @throws {ValidationError} a jsonchema library exception
     */
    return async (ctx, next) => {
      const validationOptions = {
        throwError: true,
        allowUnknownAttributes: false
      };
    
      const body = ctx.request.body;
    
      try {
        v.validate(body, schema, validationOptions);
        await next();
      } catch (error) {
        if (error instanceof ValidationError) {
          ctx.body = error;
          ctx.status = 400;      
        } else {
          throw error;
        }
      }
    }
  }
   
  /** Validate data against post schema */
  exports.validatePost = makeKoaValidator(postSchema, 'post');

  /** Validate data against user schema */
  exports.validateUser = makeKoaValidator(userSchema, 'user');

  /** Validate data against comment schema */
  exports.validateComment = makeKoaValidator(commentSchema, 'comment');

   /** Validate data against reply schema */
  exports.validateReply = makeKoaValidator(replySchema, 'reply');