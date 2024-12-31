const db = require("../../../utils/sequelize.db");
const commonService = require("../../services/commonService");
const {  jwt, ERRORS, SUCCESS, Op } = require("../../helpers/index.helper");
const { successRes, errorRes } = require("../../middlewares/response.middleware")
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize'); 

let file = "login.controller";
let Jkey = process.env.JWT_SECRET_KEY;

exports.loginRegister = async (req, res) => {
    try {
        console.log('try');
        console.log(req.body);
        let userType;
        let userName; 
        let password; 
        let inputQuery;
        userType = req.body.userType;
        userName = req.body.userName;
        password = req.body.password;
        console.log(password);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(password);
        console.log(hashedPassword);
        inputQuery = { userType: userType, userName: userName, password: hashedPassword};
        console.log('inputQuery', inputQuery);
        
        const login = new db.login(inputQuery);
        await login.save();
        res.status(201).json({ message: 'Login registered successfully' });
    } catch (error) {
        console.log('catch', error);
        if(error.name == 'SequelizeUniqueConstraintError'){
            res.status(500).json({ error: 'UserName already registered' });
        }
        else
            res.status(500).json({ error: 'Login Registration failed' });
    }
}

exports.login = async (req, res) => {
    try {
        console.log('try');
        console.log(req.body);
        let query = {};
        query.where = {
            userType: req.body.userType,
            userName: req.body.userName
        };
        console.log('query ', query);
        let user;
        if (req.body.userType && req.body.userName && req.body.password) {
            console.log('if');
            user = await commonService.findOne(db.login, query);
            console.log(user);
        }
        console.log('User ', user);
        if (!user) {
        return res.status(401).json({ error: 'User Not Found' });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        console.log(passwordMatch);
        if (!passwordMatch) {
            console.log('Password didnt matched');
            return res.status(401).json({ error: 'Password Wrong' });
        }
        let jwt_input = {
            userName: req.query.userName,
            password: req.query.password
        }
        const expire = process.env.EXPIRE;
        const token = await jwt.createToken(jwt_input, expire);
        const output = {
            data: user,
            token: token,
        }
        console.log('output : ', output);
        res.status(200).json({output});
    } catch (error) {
        console.log('catch', error);
        res.status(500).json({ error: 'Login failed' });
    }
}

      