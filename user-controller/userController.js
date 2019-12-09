var bodyParser = require("body-parser");
var VerifyToken = require("../auth-controller/VerifyToken.js"); //WIP

function USER_ROUTER(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
}

USER_ROUTER.prototype.handleRoutes = function(router, connection) {
    //router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    
    //getAll: Gets All Users in system.
    router.post("/getAll", VerifyToken, function(req, res) {
      console.log("user/getAll")
      query = 'CALL user_getAll();'
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query" });
        } else {
          res.json(rows[0]);
        }
      });
    });

    router.post("/getAllVerified", VerifyToken, function(req, res) {
      console.log("user/getAllVerified")
      query = 'CALL user_getAllVerified();'
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query" });
        } else {
          res.json(rows[0]);
        }
      });
    });

    router.post("/getAllNonVerified", VerifyToken, function(req, res) {
      console.log("user/getAll")
      query = 'CALL user_getAllNonVerified();'
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

module.exports = USER_ROUTER;