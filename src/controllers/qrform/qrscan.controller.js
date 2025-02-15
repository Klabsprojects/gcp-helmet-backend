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
        const { name, phoneNumber, reason, licenseNumber } = req.body;  // Extract licenseNumber from request body
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
        if (!licenseNumber) {
            throw new Error('licenseNumber is required');
        }
        console.log(req.body);
        let query = req.body;
        const existingEntry = await db.qrform.findOne({
            where: { licenseNumber: query.licenseNumber },
        });
        console.log('existingEntry', existingEntry);
        if (existingEntry) {
            query.qrFormId = existingEntry.id;
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
            throw new Error('licenseNumber not exist');
        
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

exports.getQrScan = async (req, res) => {
    console.log('helo from qrscan controller');
    try {
        console.log('req.query', req.query);
        let query = {};
        query.where = req.query;
        query.include = [{
            model: db.qrform,  // The qrform model
            as: 'qrformRef', // Alias used in the association
            required: true,   // Change to true if you want only results with matching qrform
          }];
         console.log('query ', query);
        let results = [];
        if (req.query.id) {
            console.log('if');
            let oneResult = await commonService.findOne(db.qrscan, query);
            results.push(oneResult);
        }
        else if(req.query.all && req.query.all == 'yes') 
        {
            query.where = {}
            console.log('else ');
            results = await commonService.findAll(db.qrscan, query);
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

      
      exports.getQrscanBySearch = async (req, res) => {
        console.log('helo from getQrscanBySearch controller', req.query);
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
    
            if (req.query.phoneNumber) {
                query.where.phoneNumber = req.query.phoneNumber;
            }
            query.include = [{
                model: db.qrform,  // The qrform model
                as: 'qrformRef', // Alias used in the association
                required: true,   // Change to true if you want only results with matching qrform
              }];
            console.log('query ', query);
            let results = [];
    
            // Fetch the results based on provided query parameters
            if (Object.keys(query.where).length === 0) {
                throw new Error('Please provide at least one valid search parameter');
            }
    
            results = await commonService.findAll(db.qrscan, query);
    
            console.log('success');
            console.log(results);
            successRes(res, results, SUCCESS.LISTED);
        } catch (error) {
            console.log('error', error);
            const message = error.message ? error.message : ERRORS.LISTED;
            errorRes(res, error, message, file);
        }
    };