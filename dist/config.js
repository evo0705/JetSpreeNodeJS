'use strict';

module.exports = {
	'secret': 'qcOPpjBuPfFCvHf8dD0O',
	'connection_string': process.env.DATABASE_URL || 'postgres://postgres:P%40ssword@localhost:5432/jetspree',
	'token_duration': 60 * 60 * 24, // expires in 24 hours
	'facebook_app_id': process.env.NODE_ENV == 'production' ? '858613437609830' : '650580988428443',
	'facebook_app_secret': process.env.NODE_ENV == 'production' ? 'd537be86d8d96b6ff56fcd2095873787' : '88574244ad4e8a659a213ca3b18f98c3',
	'facebook_callback_url': process.env.NODE_ENV == 'production' ? 'https://jetspree-node-test.herokuapp.com/login/facebook/callback' : "/login/facebook/callback",
	'google_client_id': '1026553286185-hnjobie57kruh6ehrfhgta83bjf3mato.apps.googleusercontent.com',
	'google_client_secret': '2OrzhkQ1YEqeIZ_Cy9WZqYc2',
	'google_callback_url': process.env.NODE_ENV == 'production' ? 'https://jetspree-node-test.herokuapp.com/login/google/callback' : "/login/google/callback",
	'smtp_provider': 'outlook',
	'smtp_username': 'jetspree@outlook.com',
	'smtp_password': 'drowss@P123',
	'aws_access_key_id': process.env.AWS_ACCESS_KEY_ID || 'AKIAITHJ4ICSBK5ZY77A',
	'aws_secret_access_key': process.env.AWS_SECRET_ACCESS_KEY || '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',
	's3_bucket_root': 'jetspree'
};