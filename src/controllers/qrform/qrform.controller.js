const db = require("../../../utils/sequelize.db");
const commonService = require("../../services/commonService");
const {  jwt, ERRORS, SUCCESS, Op } = require("../../helpers/index.helper");
const { successRes, errorRes } = require("../../middlewares/response.middleware")
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize'); 

let file = "qrform.controller";
let Jkey = process.env.JWT_SECRET_KEY;

exports.qrformRegister = async (req, res) => {
    try {
        console.log('Try qrform register' , req.body);
        const { name, licenseNumber, phoneNumber, bloodGroup, emergencyContactName, emergencyContactPhone, address } = req.body;  // Extract licenseNumber from request body

        if (!name) {
        throw new Error('Name is required');
        }
        if (!licenseNumber) {
            throw new Error('License number is required');
        }
        if (!phoneNumber) {
            throw new Error('Phone Number is required');
        }
        if (!bloodGroup) {
           throw new Error('BloodGroup number is required');
        }
        if (!emergencyContactName) {
            throw new Error('Emergency Contact Name is required');
        }
        if (!emergencyContactPhone) {
            throw new Error('Emergency Contact Phone number is required');
        }
        if (!address) {
            throw new Error('Address is required');
        }
        console.log(req.body);
        let query = req.body;
        const existingEntry = await db.qrform.findOne({
            where: { licenseNumber: query.licenseNumber },
        });
        if (existingEntry) {
            throw new Error('The LincenseNumber is already added');
        }
        if (req.file) {
            query.qrImagePath = req.file.path;
            console.log('Uploaded qrImage:', req.file.path);
        } else {
            throw new Error('qrImage upload failed: No qrImage uploaded');
        }

        const results = await commonService.insertOne(db.qrform, query);
        console.log(results);
        successRes(res, results, SUCCESS.CREATED);
    } catch (error) {
        console.log('catch', error);
        const message = error.message ? error.message : ERRORS.LISTED;
        errorRes(res, error, message, file);
    }
}


      