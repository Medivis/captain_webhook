// Module Includes
//=============================================================================================
const LocalStrategy = require('passport-local').Strategy;
const config = require('../../config.json')


// Configure passport
//=============================================================================================

async function initialize(passport) {

	async function authenticateUser(username, password, done) {
		if (username && username === config.USERNAME && password === config.PASSWORD)
			return done(null, { username: config.USERNAME });
		return done(null, false, { message: "Die Kombination aus Benutzername und Passwort ist ungültig." })
	}

	passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
	passport.serializeUser(function (user, done) {
		return done(null, user.username)
	})
	passport.deserializeUser(async function (id, done) {
		return done(null, { username: config.USERNAME})
	})
}

module.exports = initialize