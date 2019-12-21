USE Consultation_Opera;

DELIMITER $$
#User Stored Procedures:

create procedure user_getAllVerified()
BEGIN

SELECT U.* FROM users as U inner join StatusOfUsers as SU
on U.userStatus = SU.id
WHERE SU.title = 'Verified';

END$$

create procedure user_getAllNonVerified()
BEGIN

SELECT U.* FROM users as U inner join StatusOfUsers as SU
on U.userStatus = SU.id
WHERE SU.title = 'Not Verified'; 

END$$

create procedure user_getAll()
BEGIN

SELECT U.*,SU.title FROM users as U inner join StatusOfUsers as SU
on U.userStatus = SU.id;

END$$

create procedure user_Verify(IN userID INT)
root:BEGIN

IF NOT EXISTS (SELECT * FROM users where users.id = userID) THEN
	BEGIN
		SELECT 2 as response; #User Does not exist 
        LEAVE root;
	END;
END if;

UPDATE users
SET users.userStatus = 1
WHERE users.id = userID AND users.userStatus <> 1;
SELECT 1 as response; #User verified 
END$$


create procedure user_addNew(
    IN _firstName varchar(50),
    IN _lastName varchar(50),
    IN _userName VARCHAR(50),
    IN _userPassword VARCHAR(255),
    IN _birthDate DATE,
    IN _gender VARCHAR(6),
    IN _city VARCHAR(50),
    IN _userAddress VARCHAR(255),
    IN _email VARCHAR(100),
    IN _position INT
)
root:BEGIN

IF EXISTS (SELECT * FROM users where users.email = _email) THEN
	BEGIN
		SELECT 1 as response; #Email Already Exists
        LEAVE root;
	END;
END if;

IF EXISTS (SELECT * FROM users where users.userName = _userName) THEN
	BEGIN
		SELECT 2 as response; # User Name Already Exists
        LEAVE root;
	END;
END if;

insert into `users`(`firstName`,`lastName`,
`userName`,`userPassword`,`birthDate`,
`gender`,`city`,`userAddress`,`email`,`position`)
values
(_firstName,_lastName,_userName,_userPassword,_birthDate,
_gender,_city,_userAddress,_email,_position);

IF EXISTS (SELECT * FROM users where users.email = _email) THEN
	BEGIN
		SELECT 0 as response; # Insertion successfull
	END;
ELSE
	BEGIN
		SELECT 3 as response; #Error in Insertion
	END;
END if;
END$$

create procedure user_changePosition(
    IN _id INT,
    IN _position INT
)
BEGIN

UPDATE users
SET users.position = _position
WHERE users.id = _id;

END$$


# ---------------------------------------------- #

create procedure user_types_getAll()
BEGIN

SELECT * FROM `user_types`;

END$$

# ---------------------------------------------- #

create procedure events_getAll()
BEGIN

SELECT * FROM `events`;

END$$

CREATE PROCEDURE events_getActive()
BEGIN

SELECT * FROM `events` WHERE eventStatus = 'ACTIVE';

END$$

CREATE PROCEDURE events_getNonActive()
BEGIN

SELECT * FROM `events` WHERE eventStatus = 'DONE';

END$$

CREATE PROCEDURE halls_getAvailable()
BEGIN

SELECT * FROM halls
WHERE halls.hallStatus = 'AVAILABLE';

END$$

CREATE PROCEDURE halls_getOccupied()
BEGIN

SELECT halls.* FROM halls
WHERE halls.hallStatus = 'OCCUPIED';

END$$

CREATE PROCEDURE halls_getAll()
BEGIN

SELECT * FROM halls;

END$$

CREATE PROCEDURE halls_addNew(
    IN _hallName VARCHAR(50),
    IN _numberRows INT,
    IN _numberColumns INT)
root:BEGIN

IF EXISTS (SELECT * FROM halls where halls.hallName = _hallName) THEN
	BEGIN
		SELECT 1 as response; #Hall Already Exists
        LEAVE root;
	END;
END if;

insert into `halls`(`hallName`,`numberRows`,
`numberColumns`)
values
(_hallName,_numberRows,_numberColumns);

SELECT 0 as response; #Hall inserted succesfully

END$$


CREATE PROCEDURE halls_editHall(
	IN _id INT,
    IN _hallName VARCHAR(50),
    IN _numberRows INT,
    IN _numberColumns INT)
root:BEGIN

IF NOT EXISTS (SELECT * FROM halls where halls.id = _id) THEN
	BEGIN
		SELECT 1 as response; #Hall Does Not Exist
        LEAVE root;
	END;
END if;

UPDATE halls
SET hallName = _hallName,numberRows = _numberRows, numberColumns =_numberColumns
WHERE halls.id = _id;

SELECT 0 as response; #Hall updated succesfully

END$$

CREATE PROCEDURE events_addNew(
	IN _eventName VARCHAR(100),
	IN _eventDescription text,
    IN _eventPoster VARCHAR(255),
    IN _eventTiming DATETIME,
    IN _hallNumber int
)
root:BEGIN

IF EXISTS (SELECT * FROM events where events.eventName = _eventName) THEN
	BEGIN
		SELECT 1 as response; #Event Already Exists
        LEAVE root;
	END;
END if;

insert into `events`(`eventName`,`eventDescription`,
`eventPoster`,`eventTiming`,`hallNumber`)
values
(_eventName,_eventDescription,_eventPoster,_eventTiming,_hallNumber);

UPDATE halls
SET halls.hallStatus = 'OCCUPIED'
WHERE halls.id = _hallNumber;

SELECT 0 as response; #Hall inserted succesfully

END$$



CREATE PROCEDURE user_reserveTicket(
	IN _eventID INT,
	IN _userID INT,
    IN _reservedRow INT,
    IN _reservedColumn INT
)
root:BEGIN

IF EXISTS (SELECT * FROM reservations where reservations.userID = _userID and reservations.eventID = _eventID) THEN
	BEGIN
		SELECT 1 as response; #One Seat Already Taken For User
        LEAVE root;
	END;
END if;

insert into `reservations`(`eventID`,`userID`,
`reservedRow`,`reservedColumn`)
values
(_eventID,_userID,_reservedRow,_reservedColumn);

SELECT 0 as response; #Seat reserved succesfully

END$$


CREATE PROCEDURE event_getReservedSeats(
	IN _eventID INT
)
root:BEGIN

IF NOT EXISTS (SELECT * FROM reservations where reservations.eventID = _eventID) THEN
	BEGIN
		SELECT 1 as response; #Event does not exist
        LEAVE root;
	END;
END if;

SELECT * FROM reservations;

END$$


CREATE PROCEDURE event_cancel(
	IN _eventID INT
)
root:BEGIN

IF NOT EXISTS (SELECT * FROM events where events.id = _eventID) THEN
	BEGIN
		SELECT 1 as response; #Event does not exist
        LEAVE root;
	END;
END if;

UPDATE halls
SET halls.hallStatus = 'AVAILABLE'
WHERE halls.id = (SELECT hallNumber FROM events where events.id = _eventID);

DELETE FROM reservations WHERE reservations.eventID = _eventID;
DELETE FROM events WHERE events.id = _eventID;
SELECT 0 as response; #Event Deleted
END$$


CREATE PROCEDURE user_cancelTicket(
	IN _eventID INT,
    IN _userID INT
)
root:BEGIN

IF NOT EXISTS (SELECT * FROM events where events.id = _eventID) THEN
	BEGIN
		SELECT 1 as response; #Event does not exist
        LEAVE root;
	END;
END if;

DELETE FROM reservations WHERE reservations.eventID = _eventID and reservations.userID = _userID;

SELECT 0 as response; #reservation Deleted
END$$

CREATE PROCEDURE user_removeUser(
    IN _userID INT
)
root:BEGIN

UPDATE users
SET users.userStatus = 3 #cancelled user
WHERE users.id = _userID;

SELECT 0 as response; #reservation Deleted
END$$
