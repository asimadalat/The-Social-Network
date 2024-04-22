/**
 * A middleware authentication module using external strategy.
 * @module controllers/auth
 * @author Asim
 * @see strategies/* for authentication strategies
 */

const passport = require('koa-passport');
const jwtAuth = require('../strategies/jwt');

passport.use(jwtAuth);

/** Use basic strategy for authentication while remaining stateless */
module.exports = passport.authenticate(['jwt'], {session:false});
