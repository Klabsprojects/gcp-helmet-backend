const app = require('express')();
require("./login/login.route")(app);
require("./login/otp.route")(app);
require("./qrform/qrform.route")(app);
module.exports = app;