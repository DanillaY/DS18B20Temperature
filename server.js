const express = require('express');
const cors = require('cors');
const  mysql = require('./mysql');
const env = require('./env');

const app = express();
app.use(cors());
app.use(express.json());

// /avgTempAll doesnt require any params
app.get('/avgTempAll' ,(req,res) => {
	return mysql.getAvgTempAll().then(result => res.json(result));
});

// /avgTempThisMonth doesnt require any params 
app.get('/avgTempThisMonth' ,(req,res) => {
	const date = new Date();
	return mysql.avgTempThisMonth(date).then(result => res.json(result));
});

// /currentTemp requires the last indicator param, if param equals true then send the last temperature entry for today, otherwise send array of all temperatures for today 
app.get('/currentTemp',(req,res) => {
	const date = new Date();
	return mysql.currentTemp(date, req.query.last).then(result => res.json(result));
});

// /allTempInSetMonth requires month param and orderBy field
app.get('/allTempInSetMonth', (req,res) => {
	const year = new Date().getFullYear();
	return mysql.allTempInSetMonth(year, req.query.month,req.query.orderBy).then(result => res.json(result));
});

// /tempCountSetMonth requires a month param
app.get('/tempCountSetMonth', (req,res) => {
	const year = new Date().getFullYear();
	return mysql.tempCountSetMonth(year, req.query.month).then(result => res.json(result));
});

app.get('/medianTempCurrentMonth', async (req,res) => {
	currentMonth = new Date().getMonth()+1; 
	count = await fetch(`http://`+env.serverIp+`:`+env.serverPort+`/tempCountSetMonth?month=${currentMonth}`).then(result => result.json());
	temperatureData = await fetch(`http://`+env.serverIp+`:`+env.serverPort+`/allTempInSetMonth?month=${currentMonth}&orderBy=temp`).then(result => result.json());
	
	return mysql.medianTempCurrentMonth(currentMonth, count, temperatureData).then(result => res.json(result));
});

// /addTempToDB requires a temperature value in body (type float)
app.post('/addTempToDB', (req,res) => {
	return mysql.addTempToDb(req.body.temperature).then(result => res.json(result));
});


app.listen(3210,() => {
	console.log('Server started on port 3210');
});