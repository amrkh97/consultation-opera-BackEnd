var bodyParser = require("body-parser");
var mysql = require("mysql");
var VerifyToken = require("../auth-controller/VerifyToken.js"); //WIP

function EVENTS_ROUTER(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
}

function zeros(dimensions) {
  var array = [];

  for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
  }

  return array;
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


    router.post("/getHallForEvent", VerifyToken, function(req, res) {
      query = 'CALL event_getHallForEvent(?);'
        myTable = [
          req.body["eventID"]
        ];
        query = mysql.format(query, myTable);
        connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query" });
        } else {
          /*
          let arrAll = zeros([rows[1][0].numberRows,rows[1][0].numberColumns]);

          query = 'CALL event_getReservedSeats(?);'
          myTable = [
          req.body["eventID"]
          ];
          query = mysql.format(query, myTable);
          var reservedFinal = []
          connection.query(query, function(err, reservedSeats) {
            console.log(rows[1])
            console.log(reservedSeats)
            reservedFinal = reservedSeats[0]
            console.log("Inside: "+reservedFinal)
           });
          
           */
          res.json(rows);
           //res.status(200).send({ array: arrAll});
        }
      });
    });


};  

// ------------------------------------------------------------------------------------- //

module.exports = EVENTS_ROUTER;