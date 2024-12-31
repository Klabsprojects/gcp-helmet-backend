const { DATE, TIME } = require("sequelize");
var Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Login = sequelize.define("login", {
      userType: {
        type: DataTypes.ENUM({
          values: ['User', 'Admin', 'Hospital']
        }),
        allowNull: false,
      },
      userName: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z0-9$./]*$/,  // Allow alphanumeric, $, and ./ characters (used in bcrypt hashes)
        }
      },
      // districtId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //       model: 'district', // Refers to the table name
      //       key: 'id',       // Refers to the primary key of the table
      //   },
      // }
    },
    );
    return Login;
  };