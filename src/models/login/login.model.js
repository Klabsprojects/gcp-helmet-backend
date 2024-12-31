const { DATE, TIME } = require("sequelize");
var Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Login = sequelize.define("login", {
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z0-9$./]*$/,  // Allow alphanumeric, $, and ./ characters (used in bcrypt hashes)
        }
      },
    },
    );
    return Login;
  };