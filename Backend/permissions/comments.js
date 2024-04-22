/**
 * A module defining role permissions for CRUD operations on the comment resource.
 * @module permissions/comments
 * @author Asim
 */

const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('read').on('comment');
ac.grant('user').execute('read').on('comments');
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
    .on('comment', ['allText']);
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete')
    .on('comment', ['allText']);

ac.grant('admin').execute('read').on('comment');
ac.grant('admin').execute('read').on('comments');
ac.grant('admin').execute('update').on('comment');
ac.grant('admin').execute('delete').on('comment');

/** Verify requester can read all comments */
exports.readAll = (requester) =>
    ac.can(requester.role).execute('read').sync().on('comments');
   
/** Verify requester can read individual comments by ID */
exports.read = (requester) =>
    ac.can(requester.role).execute('read').sync().on('comment');
    
/** Verify requester can update comments based on requester and owner data */
exports.update = (requester, data) =>
    ac.can(requester.role).context({requester:requester.ID, owner:data}).execute('update').sync().on('comment');
    
/** Verify requester can delete comments based on requester and owner data */
exports.delete = (requester, data) =>
      ac.can(requester.role).context({requester:requester.ID, owner:data}).execute('delete').sync().on('comment');