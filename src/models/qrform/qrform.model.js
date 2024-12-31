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
        validate: {
          // Custom validation with regex to match both formats
          isValidLicenseNumber(value) {
            const regex = /^(DL-\d{13}|DL\d{2} \d{13})$/;
            if (!regex.test(value)) {
              throw new Error('Invalid license number format. The format should be DL-1420110012345 or DL14 20110012345.');
            }
          }
        }
      },
      phoneNumber: {
        type: DataTypes.BIGINT,
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
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      qrImagePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    );
    return Qrform;
  };