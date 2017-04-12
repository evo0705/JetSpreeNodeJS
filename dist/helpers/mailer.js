"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _nodemailerSmtpTransport = require("nodemailer-smtp-transport");

var _nodemailerSmtpTransport2 = _interopRequireDefault(_nodemailerSmtpTransport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transporter = _nodemailer2.default.createTransport((0, _nodemailerSmtpTransport2.default)({
    service: _config2.default.smtp_provider,
    auth: {
        user: _config2.default.smtp_username,
        pass: _config2.default.smtp_password
    }
}));

exports.default = transporter;

// to send email, import and call SendMail as below
// mailer.sendMail({
// 	from: 'jetspree@outlook.com',
// 	to: 'evo0705@gmail.com',
// 	subject: 'hello',
// 	html: '<b>hello world!</b>',
// 	text: 'hello world!'
// });
//# sourceMappingURL=mailer.js.map
