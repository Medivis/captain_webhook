// Module Includes
//=============================================================================================
const express = require('express')
const methodOverride = require('method-override')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')

//routers
const routerPublic = require('./routes/routes-public')
const routerAuthenticated = require('./routes/routes-authenticated')

//logic
const Advlog = require('./logic/adv-log')
const initializePassport = require('./logic/passport-config')
const auth = require('./logic/authentication')

//settings
const Config = require('../config.json')


const main = (root) => {

  // Module Setups
  //=============================================================================================
  Advlog.overrideConsoleAll(Config.LOG_PATH);

  // Setup Passport
  //=============================================================================================
  initializePassport(passport);

  // Configure Express
  //=============================================================================================
  const app = express();

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride('_method'))
  app.disable('x-powered-by');
  
  app.set('view engine', 'ejs');
  app.set('views', (__dirname + '/views'));
  app.use(express.static(root + '/public'));

  app.use(session({
    secret: Config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }))

  app.use(passport.initialize())
  app.use(passport.session())
  auth.setup(app, passport);

  // Routes
  //=============================================================================================
  app.use('/', routerPublic);
  app.use('/', auth.checkAuthenticated, routerAuthenticated)



  // Run Server
  //=============================================================================================
  if (Config.AUTO_IP == true || false) {
    app.listen(Config.PORT, function () {
      console.log(`Bind to http://localhost:${Config.PORT}`);
    })
  } else {
    app.listen(Config.PORT, Config.IP, function () {
      console.log(`Bind to http://${Config.IP}:${Config.PORT}`);
    })
  }
}

module.exports.main = main;