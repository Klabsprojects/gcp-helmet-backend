const db = require("../../../utils/sequelize.db");
const commonService = require("../../services/commonService");
const {  jwt, ERRORS, SUCCESS, Op } = require("../../helpers/index.helper");
const { successRes, errorRes } = require("../../middlewares/response.middleware")
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize'); 

let file = "qrscan.controller";
let Jkey = process.env.JWT_SECRET_KEY;

exports.qrScanRegister = async (req, res) => {
    try {
        console.log('Try qrform register' , req.body);
        const { name, phoneNumber, reason, qrFormId } = req.body;  // Extract licenseNumber from request body
        let finalResults;
        if (!name) {
        throw new Error('Name is required');
        }
        if (!phoneNumber) {
            throw new Error('Phone Number is required');
        }
        if (!reason) {
           throw new Error('Reason is required');
        }
        if (!qrFormId) {
            throw new Error('QrFormId is required');
        }
        console.log(req.body);
        let query = req.body;
        const existingEntry = await db.qrform.findOne({
            where: { id: query.qrFormId },
        });
        console.log('existingEntry', existingEntry);
        if (existingEntry) {
            finalResults = {
                "id": existingEntry.id,
                "name": existingEntry.name,
                //"licenseNumber": results.licenseNumber,
                "phoneNumber": existingEntry.phoneNumber,
                "bloodGroup": existingEntry.bloodGroup,
                "emergencyContactName": existingEntry.emergencyContactName,
                "emergencyContactPhone": existingEntry.emergencyContactPhone,
                "address": existingEntry.address,
                "qrImagePath": existingEntry.qrImagePath,
            }
        }
        else
            throw new Error('QrFormId not exist');
        const results = await commonService.insertOne(db.qrscan, query);
        console.log(results);
        
        console.log('finalResults ', finalResults);
        successRes(res, finalResults, SUCCESS.CREATED);
    } catch (error) {
        console.log('catch', error);
        const message = error.message ? error.message : ERRORS.CREATED;
        errorRes(res, error, message, file);
    }
}