import CanvasJSReact from '@canvasjs/react-charts';
 
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Chart({ data,textTitle }) {
	const options = {
		backgroundColor: "black",
		animationEnabled: true,
		exportEnabled: false,
		//theme: "light2",
		title:{
			text: textTitle,
			fontColor: "white",
		},
		axisX: {
			lineColor: "white",
			labelFontColor: "white",
			lineColor: "white",
			labelFontColor: "white",
		},
		axisY: {
			includeZero: false,
			lineColor: "white",
			labelFontColor: "white",
			valueFormatString:"## °C",
			labelFontColor: "white",
		},
		data: [{
			type: "line",
			xValueFormatString: "HH mm",
			indexLabel: "{y}",
			indexLabelFontColor: "#5A5757",
			indexLabelPlacement: "outside",
			dataPoints: data,
			lineColor: "white",
		}]
	}

	return (
		<div class='chart'>
			<CanvasJSChart options = {options}/>
		</div>
	)
}

export default Chart