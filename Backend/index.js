const app = require('./app');
const db = require("./models/index.js");

let port = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    app.listen(port);
});