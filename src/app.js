import express from "express";
import logger from "morgan";
import { config } from "dotenv";
import passport from 'passport';
import cookieParser from 'cookie-parser';
import errorHandler from "./middleware/errorHandler";
import { NotFoundError } from "./helpers/errors";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import multer from "multer";
import fs from "fs";
import expressLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import csrf from 'csurf';
//  all route imports
import authRouter from "./routes/auth.route";
import beRouter from "./routes/beAuth.route";
import dashboardRouter from "./routes/backend/dashboard.route";
import categoryRouter from "./routes/backend/category.route";
import productRouter from './routes/backend/product.route';
//
import helpers from './helpers';

config()
const app = express();
 
var MongoDBStore = require('connect-mongodb-session')(session);
// Passport Config.
require('./config/passport')(passport);
 

if (["development", "production"].includes(process.env.NODE_ENV)) {
  app.use(logger("dev"));
  if(process.env.NODE_ENV == "production")
  {
    // app.set('view cache', true);
  }
}
// setup csrf Protection middleware
const csrfProtection = csrf();

const parseForm = bodyParser.urlencoded({ extended: false });
// Static Folder
app.use(express.static(path.join(__dirname, 'public')));
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

// set template common page
app.use(expressLayouts)
// app.set('layout', './layouts/backend')
// set the view engine to ejs
app.set('view engine', 'ejs');
 
// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(cookieParser())
// Method Override
app.use(methodOverride('_method'));

var store = new MongoDBStore(
  {
    uri: process.env.DEV_DB,
    collection: 'sessions'
  }
);
store.on('error', function(error) {
  console.log(error);
});

// Express Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));
// Passport Middleware.
app.use(passport.initialize());
app.use(passport.session());

// Securitiy
app.use(helmet());
app.use(cors());

app.use(flash());
// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.user = req.user || null;
    next();
});
//helper register
helpers(app);
// app.use(csrf());
// app.use(function (req, res, next) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });
//
app.use ((req, res, next) => {
    res.locals.url = req.originalUrl;
    res.locals.host = req.get('host');
    res.locals.protocol = req.protocol;
    next();
});
// caching disabled for every route
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

// fredirect to admin path
app.get('/',function(req, res){
  res.redirect('/admin');
})
// use route
app.use('/auth', authRouter);
app.use('/admin', beRouter);
app.use('/dashboard', dashboardRouter);
app.use('/category',categoryRouter);
app.use('/product',productRouter);
// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).send("Crime Scene 404. Do not repeat");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(errorHandler);

export default app;
