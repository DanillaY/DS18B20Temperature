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
	database: 'temperature'
});


/* CAUSING ERROR WHILE TRYING TO CREATE A DATABASE, TODO: FIGURE OUT HOW TO EXECUTE QUERY

const queryDB = 'CREATE SCHEMA IF NOT EXISTS `temperature`; \
	CREATE TABLE IF NOT EXISTS `temperaturedata` ( `ID` int NOT NULL AUTO_INCREMENT, `temperature` float NOT NULL, \
	`createdDate` datetime DEFAULT CURRENT_TIMESTAMP, \
	PRIMARY KEY (`ID`), \
	UNIQUE KEY `ID_UNIQUE` (`ID`) \
	) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'

dbConnection.query(queryDB,(err,data) => {
	if(err)
		console.log(err);
});
*/

module.exports = dbConnection;
