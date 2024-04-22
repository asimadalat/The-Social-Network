/**
 * A module to perform the read operation on logs using a URI endpoint.
 * @module routes/logs
 * @author Asim
 * @see models/* for ORM model definition files
 */

const Router = require('koa-router');
const db = require('../models');
const auth = require('../controllers/auth');
const can = require('../permissions/logs');
const prefix = '/api/v1/logs';
const router = Router({prefix: prefix});

router.get('/', auth, getAllLogs);

/**
 * A function to retrieve all logs, sorted by most recent
 * @param {object} ctx - The Koa request/response
 * @returns {object} - Data requested by client 
 */
async function getAllLogs(ctx) {
  const permission = can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    try {
      const {order="timestamp", direction='DESC'} = ctx.request.query;
      let result = await db.Logs.findAll({order: [[order, direction]]});
      if (result.length) {
      const body = result.map(log => {
        const {ID, timestamp, logData} = log;

        return {ID, timestamp, logData};
      });
  
      ctx.status = 200;
      ctx.body = body;  
    } 
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = router;