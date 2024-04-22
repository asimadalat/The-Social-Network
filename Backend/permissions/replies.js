/**
 * A module defining role permissions for CRUD operations on the reply resource.
 * @module permissions/replies
 * @author Asim
 */


const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('read').on('reply');
ac.grant('user').execute('read').on('replies');
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
    .on('reply', ['allText']);
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete')
    .on('reply', ['allText']);

ac.grant('admin').execute('read').on('reply');
ac.grant('admin').execute('read').on('replies');
ac.grant('admin').execute('update').on('reply');
ac.grant('admin').execute('delete').on('reply');

/** Verify requester can read all replies */
exports.readAll = (requester) =>
    ac.can(requester.role).execute('read').sync().on('replies');
    
/** Verify requester can read individual replies by ID */
exports.read = (requester) =>
    ac.can(requester.role).execute('read').sync().on('reply');
    
/** Verify requester can update replies based on requester and owner data */
exports.update = (requester, data) =>
    ac.can(requester.role).context({requester:requester.ID, owner:data}).execute('update').sync().on('reply');
    
/** Verify requester can delete replies based on requester and owner data */
exports.delete = (requester, data) =>
      ac.can(requester.role).context({requester:requester.ID, owner:data}).execute('delete').sync().on('reply');