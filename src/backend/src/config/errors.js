const { errors } = require("celebrate");

module.exports = app => {
  app.use(errors());
};
