'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var schema = {
    'travelCountryCode': {
        notEmpty: true,
        errorMessage: 'Travel country is required.'
    },
    'returnCountryCode': {
        notEmpty: true,
        errorMessage: 'Return country is required.'
    },
    'travelDate': {
        notEmpty: true,
        errorMessage: 'Travel date is required.'
    },
    'returnDate': {
        notEmpty: true,
        errorMessage: 'Return date is required.'
    }
};

exports.default = schema;