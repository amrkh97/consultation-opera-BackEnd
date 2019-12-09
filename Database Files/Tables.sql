CREATE DATABASE IF NOT EXISTS Consultation_Opera;

USE Consultation_Opera;

CREATE TABLE IF NOT EXISTS user_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL  
);

insert into `user_types`(`title`)
values
("Site Administrator"),
("Opera Management"),
("Customer"),
("Guest");
-----------------------------------

CREATE TABLE IF NOT EXISTS StatusOfUsers(
    id int AUTO_INCREMENT primary key,
    title VARCHAR(25)
);

insert into `StatusOfUsers`(`title`)
values
('Verified'),
('Not Verified');
-----------------------------------

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    userName VARCHAR(50) NOT NULL UNIQUE,
    userPassword VARCHAR(255) NOT NULL,
    birthDate DATE DEFAULT CURRENT_DATE,
    gender VARCHAR(6),
    city VARCHAR(50),
    userAddress VARCHAR(255) DEFAULT 'None',
    email VARCHAR(100) NOT NULL UNIQUE,
    position INT,
    userStatus INT DEFAULT 2, # 2 means not verified

    FOREIGN KEY(position)
    REFERENCES user_types(id)
);

insert into `users`(`firstName`,`lastName`,
`userName`,`userPassword`,
`gender`,`city`,`email`,`position`,`userStatus`)
values
('Amr','Khaled','amrkh97','test1234','Male','Cairo','amrkh97@gmail.com',1,1);
--------------------------------------

CREATE TABLE IF NOT EXISTS halls(
    id INT AUTO_INCREMENT PRIMARY KEY,
    hallName VARCHAR(50) DEFAULT 'Opera Hall',
    numberRows INT NOT NULL,
    numberColumns INT NOT NULL
);

insert into `halls`(`hallName`,`numberRows`,`numberColumns`)
values
('Omars Hall',10,10);
--------------------------------------

CREATE TABLE IF NOT EXISTS events(
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(100) NOT NULL,
    eventDescription text,
    eventPoster VARCHAR(255) DEFAULT 'None', # FTP LINK
    eventTiming DATETIME DEFAULT CURRENT_TIMESTAMP,
    hallNumber int,
    eventStatus VARCHAR(25) DEFAULT 'ACTIVE',

    FOREIGN KEY(hallNumber)
    REFERENCES halls(id)
);

insert into `events`(`eventName`,`eventDescription`,`hallNumber`)
values
('Laugh For A Cause','The wait is finally over!!
You guessed it, 
It\'s STAND UP COMEDY  🎤🎤
Laughing is the best medicine, come laugh your stress away all for a good cause. The cause being شجرها , which is replanting formerly green spots in Maadi which are now dead due to lack of care.
This event is dedicated to raise funds for program Revive Maadi which is a community service initiative containing multiple projects, one of which is شجرها.
Rotaract Sarayat El-Maadi presents:
*Drum Roll*
Laugh for a cause
A stand up comedy event featuring:
The Elite - النخبة 
Los Bastardos
Ticket price: 100 L.E
Location: KMT House 
Event time: Thursday 12 Dec 2019
come join us and laugh for a cause
and please feel free to invite and share with your friends',1);
------------------------------------------

CREATE TABLE IF NOT EXISTS statusOfEvents(
    id int AUTO_INCREMENT PRIMARY KEY,
    statusTitle VARCHAR(25)
);

insert into `statusOfEvents`(`statusTitle`)
values
('ACTIVE'),
('CANCELLED'),
('DONE');
-------------------------------------------

CREATE TABLE IF NOT EXISTS reservations(
    id int AUTO_INCREMENT PRIMARY KEY,
    eventID int, # Foreign Key
    userID int, 
    reservedRow int,
    reservedColumn int,

    FOREIGN KEY(eventID)
    REFERENCES events(id),

    FOREIGN KEY(userID)
    REFERENCES users(id)

);