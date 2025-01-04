module.exports = (app) => {
    const value = require("../../controllers/qrform/qrform.controller");
    const { joi, cache } = require("../../helpers/index.helper");
    const {  jwt, ERRORS, SUCCESS, Op } = require("../../helpers/index.helper");
    const upload = require("../../middlewares/upload")
    app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
    app.post(
      "/qrformRegister",
      upload.single('qrImagePath'),
      value.qrformRegister
    );

    app.get(
      "/getQrformById",
      value.getQrformById
    );

    app.get(
      "/getQrformIfExisted",
      value.getQrformIfExisted
    );

    app.get(
      "/getQrform",
      [jwt.verifyToken],
      value.getQrform
    );

    app.get(
      "/checkLicenseExistence",
      value.checkLicenseExistence
    );
    
    app.get(
      "/getQrformBySearch",
      [jwt.verifyToken],
      value.getQrformBySearch
    );
}