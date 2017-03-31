import config from "../config";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

const transporter = nodemailer.createTransport(smtpTransport({
    service: config.smtp_provider,
    auth: {
        user: config.smtp_username,
        pass: config.smtp_password
    }
}));

module.exports = transporter;

// to send email, import and call SendMail as below
// mailer.sendMail({
// 	from: 'jetspree@outlook.com',
// 	to: 'evo0705@gmail.com',
// 	subject: 'hello',
// 	html: '<b>hello world!</b>',
// 	text: 'hello world!'
// });