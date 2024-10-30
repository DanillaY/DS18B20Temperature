import CanvasJSReact from '@canvasjs/react-charts';
 
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Chart({ data,textTitle }) {
	const options = {
		animationEnabled: true,
		exportEnabled: false,
		theme: "light2",
		title:{
			text: textTitle
		},
		axisY: {
			includeZero: false,
			valueFormatString:"## °C"
		},
		data: [{
			type: "line",
			xValueFormatString: "HH mm",
			indexLabel: "{y}",
			indexLabelFontColor: "#5A5757",
			indexLabelPlacement: "outside",
			dataPoints: data
		}]
	}

	return (
		<div>
			<CanvasJSChart options = {options}/>
		</div>
	)
}

export default Chart