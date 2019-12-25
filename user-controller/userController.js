var bodyParser = require("body-parser");
var mysql = require("mysql");
var VerifyToken = require("../auth-controller/VerifyToken.js"); //WIP

function USER_ROUTER(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
}

USER_ROUTER.prototype.handleRoutes = function(router, connection) {
    //router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    
    router.post("/register", VerifyToken, function(req, res) {
      query = "CALL user_addNew(?,?,?,?,?,?,?,?,?,?);"
      if (!(req.body["userAddress"])) {
        req.body["userAddress"] = "No Address Entered"
       }
      myTable = [
        req.body["firstName"],
        req.body["lastName"],
        req.body["userName"],
        req.body["userPassword"],
        req.body["birthDate"],
        req.body["gender"],
        req.body["city"],
        req.body["userAddress"],
        req.body["email"],
        req.body["position"]
      ];
      query = mysql.format(query, myTable);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query"});
        } else {
          res.json(rows[0]);
        }
      });
    });

    router.post("/getAll", VerifyToken, function(req, res) {
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

    router.post("/verify", VerifyToken, function(req, res) {
      query = "CALL user_Verify(?);"
      var userID = req.body["id"];
      query = mysql.format(query, userID);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query"});
        } else {
          res.json(rows[0]);
        }
      });
    });

    router.post("/changePosition", VerifyToken, function(req, res) {
      query = "CALL user_changePosition(?,?);"
      var userID = req.body["id"];
      var positionID = req.body["position"];
      query = mysql.format(query, [userID,positionID]);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query"});
        } else {
          res.json(rows[0]);
        }
      });
    });
    
    router.post("/reserveTicket", VerifyToken, function(req, res) {
      query = "CALL user_reserveTicket(?,?,?,?);"
      myTable = [
        req.body["eventID"],
        req.body["userID"],
        req.body["reservedRow"],
        req.body["reservedColumn"]
        
      ];
      query = mysql.format(query, myTable);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query"});
        } else {
          res.json(rows[0]);
        }
      });
    });

    router.post("/cancelTicket", VerifyToken, function(req, res) {
      query = "CALL user_cancelTicket(?,?);"
      myTable = [
        req.body["eventID"],
        req.body["userID"]
      ];
      query = mysql.format(query, myTable);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query"});
        } else {
          res.json(rows[0]);
        }
      });
    });


    router.post("/removeUser", VerifyToken, function(req, res) {
      query = "CALL user_removeUser(?);"
      myTable = [
        req.body["userID"]
      ];
      query = mysql.format(query, myTable);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query"});
        } else {
          res.json(rows[0]);
        }
      });
    });

    
    router.post("/login", VerifyToken, function(req, res) {
      query = "CALL user_login(?,?);"
      myTable = [
        req.body["userName"],
        req.body["userPassword"]
      ];
      query = mysql.format(query, myTable);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query"});
        } else {
          
          if (rows[0][0].response != 0){
            return res.status(403).send({ auth: false, message: "Wrong User Credentials!" });
          }else{
            //Send the response = 0  and all user data
            res.status(200).send({ response: rows[0][0].response, userData: rows[1][0] });
            
          }
                 
        }
      });
    });


    router.post("/editData", VerifyToken, function(req, res) {
      query = "CALL user_editData(?,?,?,?,?,?,?,?,?,?,?);"
      myTable = [
        req.body["userID"],
        req.body["firstName"],
        req.body["lastName"],
        req.body["userName"],
        req.body["userPassword"],
        req.body["birthDate"],
        req.body["gender"],
        req.body["city"],
        req.body["userAddress"],
        req.body["email"],
        req.body["position"]
      ];

      query = mysql.format(query, myTable);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query"});
        } else {
          res.json(rows[0]);
        }
      });
    });


    router.post("/myEvents", VerifyToken, function(req, res) {
      query = "CALL user_getMyEvents(?);"
      myTable = [
        req.body["userID"]
      ];
      query = mysql.format(query, myTable);
      connection.query(query, function(err, rows) {
        if (err) {
          console.log(err);
          res.json({ Error: true, Message: "Error executing MySQL query"});
        } else {
          res.json(rows[0]);
        }
      });
    });


};  

// ------------------------------------------------------------------------------------- //

module.exports = USER_ROUTER;