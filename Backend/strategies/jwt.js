/**
 * A module using the JSON Web Token strategy to authenticate a user
 * @module strategies/jwt
 * @author Asim
 * @see controllers/auth middleware module
 */

const JwtStrategy = require('passport-jwt').Strategy;
const Extract = require('passport-jwt').ExtractJwt;
const db = require('../models');
require('dotenv').config();

const options = {
  jwtFromRequest: Extract.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY
};

/**
 * Wrapper that matches the user to the jwt payload, authenticating them
 * @param {object} payload - Segment of jwt containing current user data
 * @param {done} function - Returns authentication result to passport
 * @returns {function} - Authentication result
 */
const verify = async (payload, done) => {
  try {
    const user = await db.Users.findByPk(payload.UserMetaData.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
}

const strategy = new JwtStrategy(options, verify);
module.exports = strategy;


