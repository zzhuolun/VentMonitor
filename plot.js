/*
 * Parse the data and create a graph with the data.
 */
 
function parseData(createGraph) {
	
	Papa.parse("../GetDataFromURL/93.csv", { // ../data/spanish-silver.csv
		download: true,
		complete: function(results) {
			createGraph(results.data);
		}
	});
}

function createGraph(data) {
	var time = [];
	var ExpiredO2 = [];
	var ExpiredCO2 = [];
	var frequency = [];
	var pressure = [];
	var flowrate = [];
	
	for (var i = 1; i < data.length; i++) {
		time.push(data[i][1]);
		ExpiredO2.push(data[i][2]);
		ExpiredCO2.push(data[i][3]);
		frequency.push(data[i][6]);
		pressure.push(data[i][7]);
		flowrate.push(data[i][5]);
	}
	document.getElementById('CO2').innerHTML=ExpiredO2[data.length-3];
	document.getElementById('pressure').innerHTML=pressure[data.length-3];
	document.getElementById('frequency').innerHTML=frequency[data.length-3];
	console.log(data.length)
	console.log(ExpiredO2[data.length-5]);
	console.log(time.length);
	console.log(ExpiredO2.length);
	
	//CO2
	var ctx = document.getElementById('myChart').getContext('2d');
	var config = {
	   type: 'line',
	   data: {
		  labels: time,
		  datasets: [{
			 label: 'ExpiredCO2',
			 data: ExpiredCO2,
			 borderColor:window.chartColors.blue,
			 yAxisID: 'y-axis-1',
		  },
		  {
			 label: 'ExpiredO2',
			 data: ExpiredO2,
			 borderColor: window.chartColors.red,
			 yAxisID: 'y-axis-2',
			 //backgroundColor: 'rgba(0, 119, 204, 0.3)',
		  }]
	   },
	   options: {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
						yAxes: [{
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'left',
							id: 'y-axis-1',
						}, {
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'right',
							id: 'y-axis-2',

							// grid line settings
							gridLines: {
								drawOnChartArea: false, // only want the grid lines for one axis to show up
							},
						}],
					}
	}
	};
	var chart = new Chart(ctx, config);
	
	//frequency
	var ctx1 = document.getElementById('myChart1').getContext('2d');
	var config1 = {
	   type: 'line',
	   data: {
		  labels: time,
		  datasets: [{
			 label: 'Frequency',
			 data: frequency,
			 backgroundColor: 'rgba(0, 119, 204, 0.3)',
		  }]
	   },
	   options: {
		responsive: true,
		maintainAspectRatio: false,
		
	}
	};
	var chart1 = new Chart(ctx1, config1);
	
	//pressure
	var ctx2 = document.getElementById('myChart2').getContext('2d');
	var config2 = {
	   type: 'line',
	   data: {
		  labels: time,
		  datasets: [{
			 label: 'Pressure',
			 data: pressure,
			 backgroundColor: 'rgba(0, 119, 204, 0.3)',
		  }]
	   },
	   options: {
		responsive: true,
		maintainAspectRatio: false,
	}
	};
	var chart2 = new Chart(ctx2, config2);
}

parseData(createGraph);
