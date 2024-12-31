const Otp = require("../../models/login/otp.model");
const { successRes, errorRes } = require("../../middlewares/response.middleware");
// const { Op } = require("sequelize");
const moment = require('moment');

const db = require("../../../utils/sequelize.db");
const commonService = require("../../services/commonService");
const {  jwt, ERRORS, SUCCESS, Op } = require("../../helpers/index.helper");
const axios = require('axios');
const https = require('https');



exports.generateOtp = async (req, res) => {
    try {
        const agent = new https.Agent({  
            rejectUnauthorized: false
          });
        console.log('req.body ', req.body);
        //const otpCode = Math.floor(100000 + Math.random() * 900000).toString();  
        const expiresAt = moment().add(15, 'minutes').toDate();  // Expires in 10 minutes
        var otpCode = Math.floor(1000 + Math.random() * 9000);

        //let phone = req.body.phone;
        let phone = '+91' + req.body.phone;  // or any other country code

        const inputQuery = { otpMessage: otpCode, phone: phone };
        console.log('inputQuery', inputQuery);
        const otpEntry = {
            otpCode: otpCode,
            expiresAt: expiresAt
        };
        const result = await commonService.insertOne(db.otp, otpEntry);
              if (!result) {
                errorRes(res, "OTP sent failed");
              }
               // throw new Error("Failed to save OTP in the database");
        console.log('process.env.powerstextUrl', process.env.powerstextUrl);
        //Save OTP to database
        //const smsUrl = process.env.powerstextUrl+"&mobile="+phone+"&message=Your PSCK-FS Verification Code is "+otpCode+" valid for 5 Mins - KLABS";
        const smsUrl = "https://powerstext.in/sms-panel/api/http/index.php?username=Indiaklabss&apikey=6F96A-CEFE5&apirequest=Text&sender=KTSSLC&mobile="+phone+"&message=Your PSCK-FS Verification Code is "+otpCode+" valid for 5 Mins - KLABS&route=TRANS&TemplateID=1707168862643740857&format=JSON"
        console.log('smsUrl', smsUrl);
        await axios.post(smsUrl, null, { httpsAgent: agent })
              .then((response) => {
                console.log('response ', response);
                successRes(res, { message: "OTP sent successfully" });
              }, (error) => {
                console.log('error ', error);
                errorRes(res, error.message || "OTP sent failed");
              });

              
            //   console.log('result', result);
            //successRes(res, { message: "OTP sent successfully" });
    } catch (error) {
        console.log('Error', error);
        errorRes(res, error.message || "OTP sent failed");
    }
    
};

exports.verifyOtp = async (req, res) => {
    try {
        const { otpCode } = req.body;
        if (!otpCode) {
            throw new Error("OTP code are required");
        }
        // Check if OTP exists and is not expired
        const otpRecord = await db.otp.findOne({
            where: {
                otpCode: otpCode,
                expiresAt: {
                    [Op.gte]: moment().toDate()  // Ensure OTP is not expired
                }
            }
        });
        if (!otpRecord) {
            throw new Error("Invalid or expired OTP");
        }
        // OTP is valid, proceed with further actions
        //successRes(res, { message: "OTP verified successfully" });
        successRes(res, otpRecord, SUCCESS.LISTED);
    } catch (error) {
        // errorRes(res, error.message || "OTP verification failed");
        console.log('error', error);
        const message = error.message ? error.message : ERRORS.LISTED;
        errorRes(res, error, message);
    }
};

exports.sendCredentials = async (req, res) => {
    try {
        const agent = new https.Agent({  
            rejectUnauthorized: false
          });
        console.log('req.body ', req.body);
        //const otpCode = Math.floor(100000 + Math.random() * 900000).toString();  
        const expiresAt = moment().add(10, 'minutes').toDate();  // Expires in 10 minutes
        // var otpCode = Math.floor(1000 + Math.random() * 9000);

        //let phone = req.body.phone;
        let phone = '+91' + req.body.phone;  // or any other country code
        let msg = "username: "+req.body.username+" password: "+req.body.password;
        const inputQuery = { otpMessage: otpCode, phone: phone };
        console.log('inputQuery', inputQuery);
        const otpEntry = {
            otpCode: otpCode,
            expiresAt: expiresAt
        };
        const result = await commonService.insertOne(db.otp, otpEntry);
              if (!result) {
                errorRes(res, "OTP sent failed");
              }
               // throw new Error("Failed to save OTP in the database");
        console.log('process.env.powerstextUrl', process.env.powerstextUrl);
        //Save OTP to database
        //const smsUrl = process.env.powerstextUrl+"&mobile="+phone+"&message=Your PSCK-FS Verification Code is "+otpCode+" valid for 5 Mins - KLABS";
        const smsUrl = "https://powerstext.in/sms-panel/api/http/index.php?username=Indiaklabss&apikey=6F96A-CEFE5&apirequest=Text&sender=KTSSLC&mobile="+phone+"&message=Your PSCK-FS Verification Code is "+msg+" valid for 5 Mins - KLABS&route=TRANS&TemplateID=1707168862643740857&format=JSON"
        console.log('smsUrl', smsUrl);
        await axios.post(smsUrl, null, { httpsAgent: agent })
              .then((response) => {
                console.log('response ', response);
                successRes(res, { message: "OTP sent successfully" });
              }, (error) => {
                console.log('error ', error);
                errorRes(res, error.message || "OTP sent failed");
              });

              
            //   console.log('result', result);
            //successRes(res, { message: "OTP sent successfully" });
    } catch (error) {
        console.log('Error', error);
        errorRes(res, error.message || "OTP sent failed");
    }
    
};