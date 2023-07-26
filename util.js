const moment = require("moment");
const formatMessage = (username, txt) => {
  return {
    username,
    txt,
    time: moment().format("h:mm a"),
  };
};
module.exports = formatMessage;
