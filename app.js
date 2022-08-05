const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo")(session);
const app = express();

// Load config
dotenv.config({ path: "./config/config.env" });
// Passport config
require("./config/passport")(passport);
connectDB();
// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Handelbars helpes
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");
// Handlebars
app.engine(
  ".hbs",
  engine({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");
app.set("views", "./views");
// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static("public"));
// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));
const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
