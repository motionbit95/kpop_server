var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
var usersRouter = require("./routes/user-routes");
var teacherRouter = require("./routes/teacher-routes");
var faqRouter = require("./routes/faq-routes");
var eventRouter = require("./routes/event-routes");
var curriculumRouter = require("./routes/curriculum-routes");
var inquiryRouter = require("./routes/inquiry-routes");
var reviewRouter = require("./routes/review-routes");
var zoomRouter = require("./routes/zoom-routes");
var homeRouter = require("./routes/home-routes");
var paymentRouter = require("./routes/payment-routes");

const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config");

var app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/teachers", teacherRouter);
app.use("/faq", faqRouter);
app.use("/event", eventRouter);
app.use("/curriculums", curriculumRouter);
app.use("/inquiry", inquiryRouter);
app.use("/users", usersRouter);
app.use("/review", reviewRouter);
app.use("/zoom", zoomRouter);
app.use("/home", homeRouter);
app.use("/payment", paymentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(config.port, () =>
  console.log("App is Listening on url http://localhost:" + config.port)
);

module.exports = app;
