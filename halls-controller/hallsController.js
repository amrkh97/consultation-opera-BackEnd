var bodyParser = require("body-parser");
var mysql = require("mysql");
var VerifyToken = require("../auth-controller/VerifyToken.js"); //WIP

function HALLS_ROUTER(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
}

HALLS_ROUTER.prototype.handleRoutes = function(router, connection) {
    //router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    
    router.post("/getAll", VerifyToken, function(req, res) {
      query = 'CALL halls_getAll();'
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query" });
        } else {
          res.json(rows[0]);
        }
      });
    });  
    
    router.post("/getAvailable", VerifyToken, function(req, res) {
        query = 'CALL halls_getAvailable();'
        connection.query(query, function(err, rows) {
          if (err) {
            console.log(err);
            res.json({ Error: true, Message: "Error executing MySQL query" });
          } else {
            res.json(rows[0]);
          }
        });
      });  

      router.post("/getOccupied", VerifyToken, function(req, res) {
        query = 'CALL halls_getOccupied();'
        connection.query(query, function(err, rows) {
          if (err) {
            console.log(err);
            res.json({ Error: true, Message: "Error executing MySQL query" });
          } else {
            res.json(rows[0]);
          }
        });
      }); 
      
      router.post("/addNew", VerifyToken, function(req, res) {
        query = 'CALL halls_addNew(?,?,?);'
        myTable = [
            req.body["hallName"],
            req.body["numberRows"],
            req.body["numberColumns"]
          ];
        query = mysql.format(query, myTable);
        connection.query(query, function(err, rows) {
          if (err) {
            console.log(err);
            res.json({ Error: true, Message: "Error executing MySQL query" });
          } else {
            res.json(rows[0]);
          }
        });
      });

      router.post("/editHall", VerifyToken, function(req, res) {
        query = 'CALL halls_editHall(?,?,?,?);'
        myTable = [
            req.body["id"],
            req.body["hallName"],
            req.body["numberRows"],
            req.body["numberColumns"]
          ];
        query = mysql.format(query, myTable);
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

module.exports = HALLS_ROUTER;