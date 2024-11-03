const express = require('express');
const cors = require('cors');
const dbConnection = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

function checkIfResultIsEmpty(data, queryDB,err) {

	if(data == undefined || err || data == 'thers no data in the database') {
		return true;
	}

	if(data.length == 0) {
		console.log(`no result with the set query - ${queryDB}`);
		return true;
	}

	if(Object.keys(data[0]).length == 0) {
		console.log(`no data in the database with query - ${queryDB}`);
		return true;
	}
	return false;
}

function tempDataToJSONChart(temp) {
	return { label: temp.createdDate.toLocaleString('en-us', {weekday:'long'}) +
			' ' + temp.createdDate.getHours()+ ':' +
			temp.createdDate.getMinutes(),
			y: temp.temperature} 
}

// /avgTempAll doesnt require any params
app.get('/avgTempAll' ,(req,res) => {
	const queryDB = 'SELECT ROUND(AVG(temperature.temperaturedata.temperature),2) FROM temperature.temperaturedata;';
	
	dbConnection.query(queryDB,(err,data) => {

		if(checkIfResultIsEmpty(data, queryDB,err))
			return res.json('thers no data in the database');

		return res.json({'avgTempAll':data[0]['ROUND(AVG(temperature.temperaturedata.temperature),2)']});
	});
});


// /avgTempThisMonth doesnt require any params 
app.get('/avgTempThisMonth' ,(req,res) => {
	const date = new Date();
	const queryDB = 'SELECT ROUND(AVG(temperature.temperaturedata.temperature),2) \
					FROM temperature.temperaturedata \
					WHERE MONTH(temperature.temperaturedata.createdDate) = ? \
					AND YEAR(temperature.temperaturedata.createdDate) = ?;';

	dbConnection.query(queryDB,[date.getMonth()+1,date.getFullYear()],(err,data) => {
		
		if(checkIfResultIsEmpty(data, queryDB,err))
			return res.json('no data in the database');

		return res.json({'avgTempThisMonth':data[0]['ROUND(AVG(temperature.temperaturedata.temperature),2)']});
	});
});


// /currentTemp requires the last indicator param, if param equals true then send the last temperature entry for today, otherwise send array of all temperatures for today 
app.get('/currentTemp',(req,res) => {
	const date = new Date();
	const last = req.query.last;

	const queryDB = `SELECT * FROM temperature.temperaturedata \
					WHERE YEAR(temperature.temperaturedata.createdDate) = ? AND \
					MONTH(temperature.temperaturedata.createdDate) = ? AND \
					DAY(temperature.temperaturedata.createdDate) = ? \
					${last == 'true' ? 'ORDER BY temperature.temperaturedata.ID DESC LIMIT 1;' : ';'}`;

	dbConnection.query(queryDB,[date.getFullYear(), date.getMonth()+1, date.getDate()],(err,data) => {
		
		if(checkIfResultIsEmpty(data, queryDB,err))
			return res.json('thers no data in the database');
		
		return res.json( last == 'true' ? tempDataToJSONChart(data[0]) :
			data.map( temp => tempDataToJSONChart(temp)));
	});
});

// /allTempInSetMonth requires month param and orderBy field
app.get('/allTempInSetMonth', (req,res) => {
	const year = new Date().getFullYear();
	const queryDB = `SELECT * FROM temperature.temperaturedata \
					WHERE YEAR(temperature.temperaturedata.createdDate) = ? AND \
					MONTH(temperature.temperaturedata.createdDate) = ? \
					${req.query.orderBy == 'ID' || req.query.orderBy === undefined ? 'ORDER BY temperature.temperaturedata.ID;' :
					'ORDER BY temperature.temperaturedata.temperature;'}`;

	dbConnection.query(queryDB,[year, req.query.month],(err,data) => {

		if(checkIfResultIsEmpty(data, queryDB,err))
			return res.json('thers no data in the database');
		
		return res.json(data.map( temp => tempDataToJSONChart(temp)));
	});
});

// /tempCountSetMonth requires a month param
app.get('/tempCountSetMonth', (req,res) => {
	const year = new Date().getFullYear();
	queryDB = 'SELECT COUNT(*) AS rowsCount FROM temperature.temperaturedata \
				WHERE YEAR(temperature.temperaturedata.createdDate) = ? AND \
				MONTH(temperature.temperaturedata.createdDate) = ?;'

	dbConnection.query(queryDB,[year,req.query.month],(err,data) => {
		
		if(checkIfResultIsEmpty(data, queryDB,err))
			return res.json('thers no data in the database');
		
		return res.json(data);
	});
});

app.get('/medianTempCurrentMonth', async (req,res) => {
	currentMonth = new Date().getMonth()+1; 
	count = await fetch(`http://localhost:3210/tempCountSetMonth?month=${currentMonth}`).then((result) => result.json());
	temperatureData = await fetch(`http://localhost:3210/allTempInSetMonth?month=${currentMonth}&orderBy=temp`).then((result) => result.json());
	
	if(checkIfResultIsEmpty(count,'','') || checkIfResultIsEmpty(temperatureData,'',''))
		return res.json('thers no data in the database');
	
	if(count[0].rowsCount % 2 == 0){
		sum = 0
		temperatureData.forEach((temperature,index )=> {
			if(index == Math.floor(count[0].rowsCount/2)-1 || index == Math.floor(count[0].rowsCount/2)){
				sum += temperature.y;
			}
		});
		
		return res.json({'medianTemp':sum/2});
	}
	else{
		result = 0
		temperatureData.forEach((temperature,index )=> {
			if(index == Math.floor(count[0].rowsCount/2))
				result = temperature.y
		})
		return res.json({'medianTemp':result});
	}
});

// /addTempToDB requires a temperature value in body (type float)
app.post('/addTempToDB', (req,res) => {
	const queryDB = 'INSERT INTO temperature.temperaturedata (temperature) VALUES ( ? );'

	dbConnection.query(queryDB,[req.body.temperature],(err,data) => {

		if(req.body.temperature == '' || req.body.temperature == undefined || err) {
			return res.json('The temperature value was not found in body request');
		}
		
		return res.json('The new temperature value has been added successfully');
	});
});


app.listen(3210,() => {
	console.log('Server started on port 3210');
});