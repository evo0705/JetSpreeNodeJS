const schema = {
    'travelcountrycode': {
        notEmpty: true,
		errorMessage: 'Travel country is required.'
    },
    'returncountrycode': {
        notEmpty: true,
		errorMessage: 'Return country is required.'
    },
    'traveldate': {
        notEmpty: true,
		errorMessage: 'Travel date is required.'
    },
    'returndate': {
        notEmpty: true,
		errorMessage: 'Return date is required.'
    }
}

module.exports = schema;