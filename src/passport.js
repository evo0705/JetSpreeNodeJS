import config from './config';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

module.exports = function (passport, pool) {

    // Passport session setup.
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    // Use the FacebookStrategy within Passport.
    passport.use(new FacebookStrategy({
        clientID: config.facebook_app_id,
        clientSecret: config.facebook_app_secret,
        callbackURL: config.facebook_callback_url,
        profileFields: ['id', 'displayName', 'photos', 'email'],
        passReqToCallback: true
    },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                //Check whether the User exists or not using profile.id
                (async () => {
                    let user = {};
                    let client = await pool.connect()
                    try {
                        let result = await client.query('SELECT id,email FROM users WHERE facebook_id=$1 OR email=$2',
                            [profile.id, profile.emails[0].value]);
                        if (result.rows.length == 0) {
                            result = await client.query('INSERT INTO users (email, password, facebook_id) VALUES($1,$2,$3) RETURNING id,email',
                                [profile.emails[0].value, null, profile.id]);
                        }
                        user = result.rows[0];
                    } catch (err) {
                        console.error(err.message, e.stack);
                        return done(err);
                    } finally {
                        client.release();
                    }
                    return done(null, user);
                })().catch(err => {
                    console.error(err.message, e.stack);
                    return done(err);
                });
            });
        }
    ));

    // Use the GoogleStrategy within Passport.
    passport.use(new GoogleStrategy({
        clientID: config.google_client_id,
        clientSecret: config.google_client_secret,
        callbackURL: config.google_callback_url,
        passReqToCallback: true
    },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                //Check whether the User exists or not using profile.id
                (async () => {
                    let user = {};
                    let client = await pool.connect()
                    try {
                        let result = await client.query('SELECT id,email FROM users WHERE google_id=$1 OR email=$2',
                            [profile.id, profile.emails[0].value]);
                        if (result.rows.length == 0) {
                            result = await client.query('INSERT INTO users (email, password, google_id) VALUES($1,$2,$3) RETURNING id,email',
                                [profile.emails[0].value, null, profile.id]);
                        }
                        user = result.rows[0];
                    } catch (err) {
                        console.error(err.message, e.stack);
                        return done(err);
                    } finally {
                        client.release();
                    }
                    return done(null, user);
                })().catch(err => {
                    console.error(err.message, e.stack);
                    return done(err);
                });
            });
        }
    ));

};