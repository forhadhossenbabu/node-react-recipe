const { Sequelize, sequelize } = require("../utils/database");

module.exports = sequelize.define(
  "recipe",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.TEXT
    },
    subTitle: {
      type: Sequelize.TEXT
    },
    description: {
      type: Sequelize.TEXT
    },
    mainImageURL: {
      type: Sequelize.TEXT
    },
    ending: {
      type: Sequelize.TEXT
    },
    lastModified: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },

    creator_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
);
