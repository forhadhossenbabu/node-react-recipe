const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-react", "root", "devForhad.io123", {
  dialect: "mysql"
});

module.exports = {
  sequelize,
  Sequelize
};
