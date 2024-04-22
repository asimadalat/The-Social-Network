// My social media API

const Koa = require('koa');
const cors = require('@koa/cors');
const dotenv = require('dotenv');

const app = new Koa();
app.use(cors());

const posts = require('./routes/posts.js');
const users = require('./routes/users.js');
const comments = require('./routes/comments.js')
const replies = require('./routes/replies.js')
const logs = require('./routes/logs.js')

app.use(posts.routes());
app.use(users.routes());
app.use(comments.routes());
app.use(replies.routes());
app.use(logs.routes());

dotenv.config();

module.exports = app;


