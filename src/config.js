module.exports = {

    'secret': 'qcOPpjBuPfFCvHf8dD0O',
	'connStr': process.env.DATABASE_URL || 'postgres://postgres:P%40ssword@localhost:5432/jetspree',
	'tokenDuration': 60*60*24 // expires in 24 hours
};