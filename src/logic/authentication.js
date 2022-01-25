// Module Includes
//=============================================================================================



// Setup Authentication Routes
//=============================================================================================

/**
 * Setups the Authentifikation routes to provide a login Api
 */
function setup(app, passport) {

	app.get('/login', checkNotAuthenticated, function (req, res) {
			res.render("login", { messages: { } })
	})

	app.post('/login', checkNotAuthenticated, function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.render("login", { messages: { error: info.message } })
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}
				return res.redirect('/')
			});
		})(req, res, next);
	});

	app.post('/logout', function (req, res) {
		req.logOut()
		res.redirect('/login')
	})

	app.get('/logout', function (req, res) {
		req.logOut()
		res.redirect('/login')
	})
}


/**
 * Middleware to check if a user is authenticated. Returns 403 if not authenticated.
 */
function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}

/**
 * Middleware to check if a user is *NOT* authenticated. Returns 403 if authenticated.
 */
function checkNotAuthenticated(req, res, next) {
	if (!req.isAuthenticated()) {
		return next()
	}
	res.redirect('/')
}

module.exports.checkAuthenticated = checkAuthenticated;
module.exports.checkNotAuthenticated = checkNotAuthenticated;
module.exports.setup = setup;