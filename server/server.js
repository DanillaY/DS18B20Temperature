const express = require('express');
const cors = require('cors');
const  database = require('./database');
const env = require('./env');
const logger = require('./winstonLogger');

const app = express();
app.use(cors());
app.use(express.json());

// /avgTempAll doesnt require any params
app.get('/avgTempAll' ,(req,res) => {
	return database.getAvgTempAll().then(result => res.json(result));
});

// /avgTempThisMonth doesnt require any params 
app.get('/avgTempThisMonth' ,(req,res) => {
	const date = new Date();
	return database.avgTempThisMonth(date).then(result => res.json(result));
});

// /currentTemp requires the last indicator param, if param equals true then send the last temperature entry for today, otherwise send array of all temperatures for today 
app.get('/currentTemp',(req,res) => {
	const date = new Date();
	return database.currentTemp(date, req.query.last).then(result => res.json(result));
});

// /allTempInSetMonth requires month param and orderBy field
app.get('/allTempInSetMonth', (req,res) => {
	const year = new Date().getFullYear();
	return database.allTempInSetMonth(year, req.query.month,req.query.orderBy).then(result => res.json(result));
});

// /tempCountSetMonth requires a month param
app.get('/tempCountSetMonth', (req,res) => {
	const year = new Date().getFullYear();
	return database.tempCountSetMonth(year, req.query.month).then(result => res.json(result));
});

app.get('/medianTempCurrentMonth', async (req,res) => {
	currentMonth = new Date().getMonth()+1; 
	count = await fetch(`http://${env.apiPath}/tempCountSetMonth?month=${currentMonth}`).then(result => result.json());
	temperatureData = await fetch(`http://${env.apiPath}/allTempInSetMonth?month=${currentMonth}&orderBy=temp`).then(result => result.json());
	
	return database.medianTempCurrentMonth(currentMonth, count, temperatureData).then(result => res.json(result));
});

// /addTempToDB requires a temperature value in body (type float)
app.post('/addTempToDB', (req,res) => {
	return database.addTempToDb(req.body.temperature).then(result => res.json(result));
});

// /currentVoltage requires a voltage value in body (type float)
app.post('/currentVoltage', (req,res) => {

	if(isNaN(parseFloat(req.body.currentVoltage)))
		return res.status(500).send('Internal server error');
	
	voltagePercent = (1- (env.maxBatteryVoltage - req.body.currentVoltage) / env.maxBatteryVoltage) * 100;
	logger.info(`Current voltage: ${req.body.currentVoltage} ± 0.2 v | at ${voltagePercent.toFixed(2)}%`);
	
	return res.status(200).send('Data logged successfully');

});


app.listen(env.serverPort,() => {
	logger.log('info',`Server started on port ${env.serverPort}`);
});