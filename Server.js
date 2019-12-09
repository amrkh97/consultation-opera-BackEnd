var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var application_root = __dirname;
var app = express();
var auth = require("./auth-controller/AuthController.js");
var users = require("./user-controller/userController.js")

function REST() {
  var self = this;
  self.connectMysql();
}

//To Avoid CORS Errors.
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

REST.prototype.connectMysql = function() {
  var self = this;
  var pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "developer",
    password: "Consultation2019",
    database: "Consultation_Opera",
    debug: false
  });

  pool.getConnection(function(err, connection) {
    if (err) {
      self.stop(err);
    } else {
      self.configureExpress(connection);
    }
  });
};

REST.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(express.json());
    var usersRouterObj = express.Router();
    app.use("/user", usersRouterObj);
    
    //Instantiate the Routes:
    new users(usersRouterObj, connection);
    self.startServer();
};

 
REST.prototype.startServer = function() {
    app.use( express.static( application_root ) )
    app.listen(3000, function() {
      console.log("Server running at port 3000");
    });
};
  
REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL -" + err);
    process.exit(1);
};

//creates the server
new REST();