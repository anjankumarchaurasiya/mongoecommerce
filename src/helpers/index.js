const timeago = require('./timeago');
const paginate = require('./paginate');
module.exports = (app) => {
    app.locals.timeago = timeago;
    app.locals.paginate = paginate;
};