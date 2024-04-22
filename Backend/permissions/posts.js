/**
 * A module defining role permissions for CRUD operations on the post resource.
 * @module permissions/posts
 * @author Asim
 */

const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('read').on('post');
ac.grant('user').execute('read').on('posts');
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
    .on('post', ['title', 'bodyText', 'imageURL', 'published']);
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete')
    .on('post', ['title', 'bodyText', 'imageURL', 'published']);

ac.grant('admin').execute('read').on('post');
ac.grant('admin').execute('read').on('posts');
ac.grant('admin').execute('update').on('post');
ac.grant('admin').execute('delete').on('post');

/** Verify requester can read all posts */
exports.readAll = (requester) =>
    ac.can(requester.role).execute('read').sync().on('posts');
    
/** Verify requester can read individual posts by ID */
exports.read = (requester) =>
    ac.can(requester.role).execute('read').sync().on('post');
    
/** Verify requester can update posts based on requester and owner data */
exports.update = (requester, data) =>
    ac.can(requester.role).context({requester:requester.ID, owner:data}).execute('update').sync().on('post');
    
/** Verify requester can delete posts based on requester and owner data */
exports.delete = (requester, data) =>
      ac.can(requester.role).context({requester:requester.ID, owner:data}).execute('delete').sync().on('post');