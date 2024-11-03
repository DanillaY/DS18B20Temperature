const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const dbConnection = mysql.createConnection({
	host: process.env.MYSQL_SERVICE,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	port: process.env.MYSQL_PORT,
	waitForConnections: true,
	maxIdle: 10,
	multipleStatements: true
});


const queryDB = 'CREATE SCHEMA IF NOT EXISTS `temperature`; \
	USE `temperature`; \
	CREATE TABLE `temperaturedata` (`ID` int NOT NULL AUTO_INCREMENT, `temperature` float NOT NULL, \
	`createdDate` datetime DEFAULT CURRENT_TIMESTAMP, \
	PRIMARY KEY (`ID`), \
	UNIQUE KEY `ID_UNIQUE` (`ID`));'

dbConnection.query(queryDB,(err,data) => {
	if(err)
		console.log(err);
});


module.exports = dbConnection;
