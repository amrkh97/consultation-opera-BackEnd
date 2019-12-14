var bodyParser = require("body-parser");
var mysql = require("mysql");
var VerifyToken = require("../auth-controller/VerifyToken.js"); //WIP

function EVENTS_ROUTER(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
}

EVENTS_ROUTER.prototype.handleRoutes = function(router, connection) {
    //router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    
    //getAll: Gets All Users in system.
    router.post("/getAll", VerifyToken, function(req, res) {
      console.log("events/getAll")
      query = 'CALL events_getAll();'
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query" });
        } else {
          res.json(rows[0]);
        }
      });
    });    

};  

// ------------------------------------------------------------------------------------- //

module.exports = EVENTS_ROUTER;