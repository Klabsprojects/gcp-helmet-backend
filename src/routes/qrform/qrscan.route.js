module.exports = (app) => {
    const value = require("../../controllers/qrform/qrscan.controller");
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
      "/qrScanRegister",
      value.qrScanRegister
    );

    app.get(
      "/getQrScan",
      [jwt.verifyToken],
      value.getQrScan
    );

    app.get(
      "/getQrscanBySearch",
      [jwt.verifyToken],
      value.getQrscanBySearch
    );

}