import CanvasJSReact from '@canvasjs/react-charts';
 
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Chart({ data,textTitle }) {
	const options = {
		backgroundColor: "#101010",
		animationEnabled: true,
		exportEnabled: false,
		height: 450,
		title:{
			text: textTitle,
			fontColor: "white",
		},
		axisX: {
			lineColor: "white",
			labelFontColor: "white",
		},
		axisY: {
			includeZero: false,
			lineColor: "white",
			valueFormatString:"## °C",
			labelFontColor: "white",
		},
		data: [{
			type: "line",
			xValueFormatString: "HH mm",
			indexLabel: "{y}",
			indexLabelFontColor: "white",
			indexLabelPlacement: "outside",
			dataPoints: data,
			lineColor: "white",
		}]
	}

	return (
		<div className='chart'>
			<CanvasJSChart options = {options}/>
		</div>
	);
}

export default Chart;