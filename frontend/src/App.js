import React, { useEffect, useState } from 'react';
import Chart from './components/chart';
import './App.css';
import Button from './components/button';

export function ApiChartResult({data,textTitle}) {

	if(Object.keys(data).length === 0 || data === undefined)
		return <h4>Fetching data from api...</h4>

	else if(data.label === '')
		return <h4>No data was found</h4>

	else 
		return <Chart data={data} textTitle={textTitle}></Chart>
}


function App() {
	const [graphTodayTemperature,setGraphTodayTemperature] = useState({});
	const [avgTemp,setAvgTemp] = useState({});
	const [graphAllTempInMonth,setGraphAllTempInMonth] = useState({});
	const [date,setDate] = useState(new Date());
	const [medianTempThisMonth,setMedian] = useState({});
	const [buttonToggle,setToggle] = useState(false);
	const serverPath = process.env.REACT_APP_BASE_PATH

	const fetchData = async (link, setData) => {
		fetch(link)
			.then((result) => result.json())
			.then((json) => setData(json))
			.catch(err => console.log(err));
	}

	const handleToggle = () => {
		setToggle(!buttonToggle);
	}
		
	useEffect(() => {
		setInterval(() => {
			fetchData( serverPath + '/currentTemp', setGraphTodayTemperature);
			fetchData( serverPath + '/avgTempThisMonth', setAvgTemp);
			fetchData( serverPath + `/allTempInSetMonth?month=${date.getMonth()+1}`, setGraphAllTempInMonth);
			fetchData( serverPath + `/medianTempCurrentMonth`, setMedian);
			
		},7000)
	},[])

	return (
		<div className='mainPage'>
			
			<div className='grid'>
				<h4>{ avgTemp.avgTempThisMonth === undefined ? 'Loading data...' : `🌡️ Average temperature in this month ${avgTemp.avgTempThisMonth} °C`}</h4>
				<h4>{ medianTempThisMonth.medianTemp === undefined ? 'Loading data...' : `🌞 Median temperature for this month ${medianTempThisMonth.medianTemp} °C`}</h4>
			</div>
			{
				buttonToggle === true ? 
				<div>
					<Button text={`See this month's graph`} onClick={handleToggle}/>
					<ApiChartResult data={graphTodayTemperature} textTitle='Temperature for today'/>
				</div> :
				
				<div>
					<Button text={`See today's graph`} onClick={handleToggle}/>
					<ApiChartResult data={graphAllTempInMonth} textTitle='Temperature for this month'/> 
				</div>
				
			}
		</div>
	)
}

export default App;