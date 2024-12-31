const { DATE, TIME } = require("sequelize");
var Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Qrform = sequelize.define("qrform", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      licenseNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bloodGroup: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emergencyContactName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emergencyContactPhone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    );
    return Qrform;
  };