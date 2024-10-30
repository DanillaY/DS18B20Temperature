import React, { useEffect, useState } from 'react';
import Chart from './chart';
import './App.css'

function ApiChartResult({data,textTitle}) {
	
	if(Object.keys(data).length === 0 || data === undefined)
		return <p>Fetching data from api...</p>

	else if(data === 'thers no data in the database')
		return <p>No data was found for today</p>

	else 
		return <Chart data={data} textTitle={textTitle}></Chart>
}


function App() {
	const [graphData,setGraphData] = useState({});
	const [avgTemp,setAvgTemp] = useState({});
	const [allTempInMonth,setAllTempInMonth] = useState({});
	const [date,setDate] = useState(new Date());
	const [medianTempThisMonth,setMedian] = useState({});

	const fetchData = async (link, setData) => {
		fetch(link)
			.then((result) => result.json())
			.then((json) => setData(json))
			.catch(err => console.log(err));
	}
		
	useEffect(() => {
		setInterval(() => {
			fetchData('http://localhost:3210/currentTemp', setGraphData);
			fetchData('http://localhost:3210/avgTempThisMonth', setAvgTemp);
			fetchData(`http://localhost:3210/allTempInSetMonth?month=${date.getMonth()+1}`, setAllTempInMonth);
			fetchData(`http://localhost:3210/medianTempCurrentMonth`, setMedian);
		},7000)
	},[])

	return (
		<div>
			<div class='grid'>
				<h4>{ avgTemp.avgTempThisMonth === undefined ? 'Loading data...' : `Average temperature in this month ${avgTemp.avgTempThisMonth} °C`}</h4>
				<h4>{ medianTempThisMonth.medianTemp === undefined ? JSON.stringify(medianTempThisMonth.medianTemp) : `Median temperature for this month ${medianTempThisMonth.medianTemp} °C`}</h4>
			</div>
			
			<ApiChartResult data={graphData} textTitle='Temperature for today'/>
			<ApiChartResult data={allTempInMonth} textTitle='Temperature for this month'/>
		</div>
	)
}

export default App;