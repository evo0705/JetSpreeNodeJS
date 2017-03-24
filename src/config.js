module.exports = {
	'secret': 'qcOPpjBuPfFCvHf8dD0O',
	'connection_string': process.env.DATABASE_URL || 'postgres://postgres:P%40ssword@localhost:5432/jetspree',
	'token_duration': 60 * 60 * 24, // expires in 24 hours
	'facebook_app_id': process.env.FACEBOOK_APP_ID || '650580988428443',
	'facebook_app_secret': process.env.FACEBOOK_APP_SECRET || '88574244ad4e8a659a213ca3b18f98c3',
	'facebook_callback_url': (process.env.NODE_ENV == 'production' ? 'https://jetspree-node-test.herokuapp.com/login/facebook/callback' : "/login/facebook/callback"),
	'google_client_id': process.env.GOOGLE_CLIENT_ID,
	'google_client_secret': process.env.GOOGLE_CLIENT_SECRET,
	'google_callback_url': (process.env.NODE_ENV == 'production' ? 'https://jetspree-node-test.herokuapp.com/login/google/callback' : "/login/google/callback"),
	'smtp_provider': 'outlook',
	'smtp_username': 'jetspree@outlook.com',
	'smtp_password': process.env.SMTP_PASSWORD || 'xxx',
	'aws_access_key_id': process.env.AWS_ACCESS_KEY_ID || 'xxx',
	'aws_secret_access_key': process.env.AWS_SECRET_ACCESS_KEY || 'xxx',
	's3_bucket_root': 'jetspree'
};
