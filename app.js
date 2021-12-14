var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
var fs = require("fs");
var path = require("path");

var bookRoute = require("./api/route/books");

var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("dev"));
var logStream = fs.createWriteStream(path.join(__dirname, "/logs/access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: logStream }));

app.use("/", bookRoute);

app.use((req, res, next) => {
  var error = new Error("Route not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

const port = 3000;
app.listen(port, (error) => {
  if (error) console.log(error);
  else console.log("server is running on port:" + port);
});
