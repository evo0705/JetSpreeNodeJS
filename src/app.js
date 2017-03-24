// libraries
import 'babel-polyfill';
import config from './config';
import express from 'express';
import expressSession from 'express-session';
import expressValidator from 'express-validator';
import helmet from 'helmet';
import pgPool from 'pg-pool';
import url from 'url';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportSetup from './passport';
import flash from 'connect-flash';
import aws from 'aws-sdk';

// index routes
import index from './routes/index';
// public routes
import countries from './routes/countries';
import twitter from './routes/twitter';
import login from './routes/login';
import requests from './routes/requests';
import image from './routes/image';
import trips from './routes/trips';
// private routes
import authorize from './routes/private/authorize';
import authUser from './routes/private/user';
import authRequests from './routes/private/requests';
import authTrips from './routes/private/trips';

const app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator([]));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	let parsedConnStr = url.parse(config.connection_string);
	let dbAuth = parsedConnStr.auth.split(':');
	let dbConfig = {
		user: dbAuth[0],
		password: dbAuth[1],
		host: parsedConnStr.hostname,
		port: parsedConnStr.port,
		database: parsedConnStr.pathname.split('/')[1],
		ssl: req.secure
	};
	req.pool = new pgPool(dbConfig);
	passportSetup(passport, req.pool);
	aws.config.credentials = new aws.Credentials(config.aws_access_key_id, config.aws_secret_access_key);
	req.aws = aws;
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// required for passport
app.use(expressSession({
	secret: config.secret,
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Facebook Passport Router
app.get('/login/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/login/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect: '/login/authenticated',
		failureRedirect: '/login'
	}));

//Google Passport Router
app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/login/google/callback',
	passport.authenticate('google', {
		successRedirect: '/login/authenticated',
		failureRedirect: '/login'
	}));

app.use('/', index);
app.use('/countries', countries);
app.use('/twitter', twitter);
app.use('/login', login);
app.use('/requests', requests);
app.use('/image', image);
app.use('/trips', trips);

// routes that requires login to access
authorize.use('/user', authUser);
authorize.use('/requests', authRequests);
authorize.use('/trips', authRequests);
app.use('/auth', authorize);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.listen(process.env.PORT || 3001, function () {
	console.log("Started on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
