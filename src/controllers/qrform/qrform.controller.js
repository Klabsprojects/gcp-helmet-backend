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
        const message = error.message ? error.message : ERRORS.CREATED;
        errorRes(res, error, message, file);
    }
}

exports.getQrformById = async (req, res) => {
    console.log('helo from qrform controller');
    try {
        console.log('req.query', req.query);
        let query = {};
        query.where = req.query;
         console.log('query ', query);
        let results;
        let finalResults;
        if (req.query.id) {
            console.log('if');
            results = await commonService.findOne(db.qrform, query);
            finalResults = {
                "id": results.id,
                "name": results.name,
                //"licenseNumber": results.licenseNumber,
                "phoneNumber": results.phoneNumber,
                "bloodGroup": results.bloodGroup,
                "emergencyContactName": results.emergencyContactName,
                "emergencyContactPhone": results.emergencyContactPhone,
                "address": results.address,
                "qrImagePath": results.qrImagePath,
            }
        }
        else 
            throw new Error('Pls provide valid parameters');
        console.log('success');
        console.log(finalResults);
        successRes(res, finalResults, SUCCESS.LISTED);
    } catch (error) {
        console.log('error', error);
        const message = error.message ? error.message : ERRORS.LISTED;
        errorRes(res, error, message, file);
    }
}  

exports.checkLicenseExistence = async (req, res) => {
    console.log('helo from checkLicenseExistence controller');
    try {
        console.log('req.query', req.query);
        let query = {};
        query.where = req.query;
        let message;
         console.log('query ', query);
        let oneResult;
        if (req.query.licenseNumber) {
            console.log('if');
            oneResult = await commonService.findOne(db.qrform, query);
            console.log(oneResult);
            if(oneResult == null){
                //throw new Error('Pls provide valid License Number');
                message = "LicenseNumber is valid";
            }
            else
            throw new Error('License Number already exist');
        }
        else
            throw new Error('Pls provide valid License Number');
        console.log('success');
        console.log(oneResult);
        successRes(res, message, SUCCESS.LICENSE_EXISTANCE);
    } catch (error) {
        console.log('error', error);
        const message = error.message ? error.message : ERRORS.LICENSE_EXISTANCE;
        errorRes(res, error, message, file);
    }
}

exports.getQrform = async (req, res) => {
    console.log('helo from qrform controller');
    try {
        console.log('req.query', req.query);
        let query = {};
        query.where = req.query;
         console.log('query ', query);
        let results = [];
        if (req.query.id) {
            console.log('if');
            let oneResult = await commonService.findOne(db.qrform, query);
            results.push(oneResult);
        }
        else if(req.query.all && req.query.all == 'yes') 
        {
            query.where = {}
            console.log('else ');
            results = await commonService.findAll(db.qrform, query);
        }
        else 
            throw new Error('Pls provide valid parameters');
        console.log('success');
        console.log(results);
        successRes(res, results, SUCCESS.LISTED);
    } catch (error) {
        console.log('error', error);
        const message = error.message ? error.message : ERRORS.LISTED;
        errorRes(res, error, message, file);
    }
}
      
      exports.getQrformBySearch = async (req, res) => {
        console.log('helo from getQrformBySearch controller', req.query);
        try {
            // Log the entire request to debug
            //console.log('Full Request:', req);
    
            // Log just the query parameters
            console.log('req.query', req.query);
    
            let query = {};
            query.where = {};
    
            // Conditionally add filters based on query parameters
            if (req.query.name) {
                query.where.name = { [Sequelize.Op.like]: `%${req.query.name}%` };  // Partial match for name
            }
    
            if (req.query.licenseNumber) {
                query.where.licenseNumber = req.query.licenseNumber;
            }
    
            if (req.query.phoneNumber) {
                query.where.phoneNumber = req.query.phoneNumber;
            }
    
            console.log('query ', query);
            let results = [];
    
            // Fetch the results based on provided query parameters
            if (Object.keys(query.where).length === 0) {
                throw new Error('Please provide at least one valid search parameter');
            }
    
            results = await commonService.findAll(db.qrform, query);
    
            console.log('success');
            console.log(results);
            successRes(res, results, SUCCESS.LISTED);
        } catch (error) {
            console.log('error', error);
            const message = error.message ? error.message : ERRORS.LISTED;
            errorRes(res, error, message, file);
        }
    };
    