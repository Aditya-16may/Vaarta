const { Resend } = require("resend");
require("dotenv").config();

module.exports.resendClient = new Resend(process.env.RESEND_API_KEY);

module.exports.sender = {
    email : process.env.EMAIL_FROM,
    name : process.env.EMAIL_FROM_NAME
}; 
