const { DATE, TIME } = require("sequelize");
var Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Otp = sequelize.define("otp", {
        otpCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    );
    return Otp;
  };



// const mongoose = require('mongoose');
// const { ObjectId } = require('mongodb');
// const Schema = mongoose.Schema;

// const loginSchema = new Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
// 	password: {
//     type: String,
//     required: true
//   },
// 	loginAs: {
//     type: String,
//     required: true
//   },
// 	activeStatus: {
//     type: Boolean,
//     required: true,
//     default: true
//   },
// 	createdAt: {
// 		type: Date, 
// 		default: Date.now
// 	},
// });

// module.exports = mongoose.model('login', loginSchema);
