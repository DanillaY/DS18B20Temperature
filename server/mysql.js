const mysql = require('mysql2');
const env = require('./env');
const logger = require('./winstonLogger');

const dbConnection = mysql.createConnection({
	host: env.mysqlService,
	user: env.mysqlUser,
	password: env.mysqlPassword,
	port: env.mysqlPort,
	waitForConnections: true,
	maxIdle: 10,
	multipleStatements: true
});

function checkIfResultIsEmpty(data, err) {

	if(data === undefined || data === null || err) {
		return true;
	}

	if(data.length == 0) {
		logger.warn(new Error(`no result with the previous query`));
		return true;
	}

	if(Object.values(data[0]).some(temp=> temp === null || temp === '' || temp === 0)) {
		logger.warn(new Error(`no result with the previous query`));
		return true;
	}

	return false;
}

function tempDataToJSONChart(temp) {
	return { label: temp.createdDate.toLocaleString('en-us', {weekday:'long'}) +
			' ' + temp.createdDate.getHours()+ ':' +
			(temp.createdDate.getMinutes() < 10 ? '0' : '') + temp.createdDate.getMinutes(),
			y: temp.temperature, markerColor: 'white' }; 
}

async function executeDBQeuryPromise(queryDB,params) {
	return new Promise((resolve,reject) => {
		dbConnection.query(queryDB,params,(err,data) => {
			err ? reject(err): resolve(data)
		});
	})
}

async function initTemperatureDatabase() {
	const queryDB = 'CREATE SCHEMA IF NOT EXISTS `temperature`; \
	USE `temperature`; \
	CREATE TABLE IF NOT EXISTS `temperaturedata` (`ID` int NOT NULL AUTO_INCREMENT, `temperature` float NOT NULL, \
	`createdDate` datetime DEFAULT CURRENT_TIMESTAMP, \
	PRIMARY KEY (`ID`), \
	UNIQUE KEY `ID_UNIQUE` (`ID`));'

	dbConnection.query(queryDB,(err,data) => {
		if(err)
			logger.error(new Error(err));
	});
}

module.exports.getAvgTempAll = async function getAvgTempAll() {
	const queryDB = 'SELECT ROUND(AVG(temperature.temperaturedata.temperature),2) as avgTemp FROM temperature.temperaturedata;';

	return await executeDBQeuryPromise(queryDB,null).then(result => {
		if (checkIfResultIsEmpty(result, null))
			return {'avgTempThisMonth':0};
		
		return {'avgTempAll':result[0]['avgTemp']};
	});
}

module.exports.avgTempThisMonth = async function avgTempThisMonth(date) {
	const queryDB = 'SELECT ROUND(AVG(temperature.temperaturedata.temperature),2) as avgTemp \
					FROM temperature.temperaturedata \
					WHERE MONTH(temperature.temperaturedata.createdDate) = ? \
					AND YEAR(temperature.temperaturedata.createdDate) = ?;';

	return await executeDBQeuryPromise(queryDB,[date.getMonth()+1,date.getFullYear()]).then(result => {
		if(checkIfResultIsEmpty(result, null))
			return {'avgTempThisMonth':0};
		
		return {'avgTempThisMonth':result[0]['avgTemp']};
	});
}

module.exports.tempCountSetMonth = async function tempCountSetMonth(year,month) {

	const queryDB = 'SELECT COUNT(*) AS rowsCount FROM temperature.temperaturedata \
				WHERE YEAR(temperature.temperaturedata.createdDate) = ? AND \
				MONTH(temperature.temperaturedata.createdDate) = ?;';

	return await executeDBQeuryPromise(queryDB,[year,month]).then(result => {
		if(checkIfResultIsEmpty(result, null))
			return {"rowsCount": 0};
		
		return result[0];
	});
}

module.exports.medianTempCurrentMonth = async function medianTempCurrentMonth(currentMonth, count, temperatureData) {
	
	if(count == { rowsCount: 0 } || checkIfResultIsEmpty(temperatureData,'',''))
		return {'medianTemp': 0};
	
	if(count.rowsCount % 2 == 0){
		sum = 0
		temperatureData.forEach((temperature,index )=> {
			if(index == Math.floor(count.rowsCount/2)-1 || index == Math.floor(count.rowsCount/2)){
				sum += temperature.y;
			}
		});
		
		return {'medianTemp':sum/2};
	}
	else{
		result = 0
		temperatureData.forEach((temperature,index )=> {
			if(index == Math.floor(count.rowsCount/2))
				result = temperature.y
		})
		return {'medianTemp':result};
	}
}

module.exports.currentTemp = async function currentTemp(date,last) {
	const queryDB = `SELECT * FROM temperature.temperaturedata \
					WHERE YEAR(temperature.temperaturedata.createdDate) = ? AND \
					MONTH(temperature.temperaturedata.createdDate) = ? AND \
					DAY(temperature.temperaturedata.createdDate) = ? \
					${last == 'true' ? 'ORDER BY temperature.temperaturedata.ID DESC LIMIT 1;' : ';'}`;

	return await executeDBQeuryPromise(queryDB,[date.getFullYear(), date.getMonth()+1, date.getDate()]).then((result) => {
		if(checkIfResultIsEmpty(result, null))
			return {'label': '' , 'y': 0.0, markerColor: 'white' };
		
		return last == 'true' ? tempDataToJSONChart(result[0]) :
			result.map( temp => tempDataToJSONChart(temp));
	});
}

module.exports.allTempInSetMonth = async function allTempInSetMonth(year, month, orderBy) {
	const queryDB = `SELECT * FROM temperature.temperaturedata \
					WHERE YEAR(temperature.temperaturedata.createdDate) = ? AND \
					MONTH(temperature.temperaturedata.createdDate) = ? \
					${orderBy == 'ID' || orderBy === undefined ? 'ORDER BY temperature.temperaturedata.ID;' :
					'ORDER BY temperature.temperaturedata.temperature;'}`;

	return await executeDBQeuryPromise(queryDB,[year, month]).then((result) => {
		if(checkIfResultIsEmpty(result, null))
			return [{ 'label': '','y': 0.0}];
		
		return result.map( temp => tempDataToJSONChart(temp));
	});
}

module.exports.addTempToDb = async function addTempToDb(temperature) {

	if(temperature == undefined || temperature == null)
		return 'Temperature value was not set'

	const queryDB = 'INSERT INTO temperature.temperaturedata (temperature) VALUES (?);'

	return await executeDBQeuryPromise(queryDB,[temperature]).then(() => {
		if(temperature == '' || temperature == undefined)
			return 'The temperature value was not found in body request';
		
		return 'The new temperature value has been added successfully';
	});
}


initTemperatureDatabase();
