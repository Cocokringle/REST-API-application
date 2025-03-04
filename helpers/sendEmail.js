const sgMail = require("@sendgrid/mail");
require('dotenv').config();
const {SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async(data)=> {
    const email = { ...data, from: "lysenko.init@gmail.com" };
    try {
        await sgMail.send(email);
        return true;
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = sendEmail;