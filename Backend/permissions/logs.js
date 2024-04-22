/**
 * A module defining role permissions for CRUD operations on the log resource.
 * @module permissions/logs
 * @author Asim
 */

const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('admin').execute('read').on('log');
ac.grant('admin').execute('read').on('logs');
ac.grant('user').condition({Fn:'EQUALS', args: {0:1}}).execute('read').on('logs');

/** Verify requester can read all logs */
exports.readAll = (requester) =>
    ac.can(requester.role).execute('read').sync().on('logs');