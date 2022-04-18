const moment = require('moment');

module.exports = (timestamp) => {
        // return moment(timestamp).startOf('minute').fromNow();
        return moment(timestamp).format('hh:mm a MMM DD YYYY');
}