const { DATE, TIME } = require("sequelize");
var Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Qrscan = sequelize.define("qrscan", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      qrFormId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'qrform', // Refers to the table name
            key: 'id',       // Refers to the primary key of the table
        },
      },
    },
    );
    return Qrscan;
  };