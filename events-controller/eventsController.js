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
    
    router.post("/getAll", VerifyToken, function(req, res) {
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
    
    router.post("/create", VerifyToken, function(req, res) {
      query = 'CALL events_addNew(?,?,?,?,?);'
        myTable = [
          req.body["eventName"],
          req.body["eventDescription"],
          req.body["eventPoster"],
          req.body["eventTiming"],
          req.body["hallNumber"]
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

    router.post("/cancel", VerifyToken, function(req, res) {
      query = 'CALL event_cancel(?);'
        myTable = [
          req.body["eventID"]
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
    
    router.post("/getReservedSeats", VerifyToken, function(req, res) {
      query = 'CALL event_getReservedSeats(?);'
        myTable = [
          req.body["eventID"]
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
    
    router.post("/uploadPoster", VerifyToken, function(req, res) {
      query = 'CALL event_updatePoster(?,?);'
        myTable = [
          req.body["eventID"],
          req.body["posterPath"]
        ];
        query = mysql.format(query, myTable);
        connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query" });
        } else {
          console.log(rows[0])
          res.json(rows[0]);
        }
      });
    });


};  

// ------------------------------------------------------------------------------------- //

module.exports = EVENTS_ROUTER;