/**
 * A module defining role permissions for CRUD operations on the user resource.
 * @module permissions/users
 * @author Asim
 */

const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('read')
    .on('user', ['*', '!password', '!passwordSalt']);
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
    .on('user', ['name', 'username', 'bio', 'password', 'email', 'avatarURL']);
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete')
    .on('user', ['name', 'username', 'bio', 'password', 'email', 'avatarURL']);

ac.grant('admin').execute('read').on('user');
ac.grant('admin').execute('read').on('users');
ac.grant('admin').execute('update').on('user');
ac.grant('admin').condition({Fn:'NOT_EQUALS', args:
    {'requester':'$.owner'}}).execute('delete').on('user');

/** Verify requester can read all users */
exports.readAll = (requester) =>
    ac.can(requester.role).execute('read').sync().on('users');

/** Verify requester can read individual users by ID */
exports.read = (requester, data) =>
    ac.can(requester.role).context({requester:requester.ID, owner:Number(data.id)}).execute('read').sync().on('user');
    
/** Verify requester can update users based on requester and owner data */
exports.update = (requester, data) =>
    ac.can(requester.role).context({requester:requester.ID, owner:Number(data.id)}).execute('update').sync().on('user');
    
/** Verify requester can delete users based on requester and owner data */
exports.delete = (requester, data) =>
      ac.can(requester.role).context({requester:requester.ID, owner:Number(data.id)}).execute('delete').sync().on('user');
    
