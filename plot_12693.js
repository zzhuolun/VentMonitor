/*
 * Parse the data and create a graph with the data.
 */

function parseData(createGraph) {
	Papa.parse("../GetDataFromURL/12693.csv", { // ../data/spanish-silver.csv
		download : true,
		complete : function(results) {
			createGraph(results.data);
		}
	});
}

function createGraph(data) {
	var time = [];
	var ExpiredCO2 = [];
	var ExpiredO2 = [];
	var mve = [];
	var flowrate = [];
	var pressure = [];
    
	var time_PREDICT = [];
	var ExpiredCO2_PREDICT = [];
	var ExpiredO2_PREDICT = [];
	var mve_PREDICT = [];
	var pressure_PREDICT = [];

	var amountPointsInPlot = 50
	var time_latest = -1
    var index_latest = -1
	for (var i = 1; i < data.length; i++) {
		if (data[i] == "") {
			break;
		}

		if (data.length < amountPointsInPlot) {
			// always plots,
 
            let unix_timestamp = Number(data[i][1])
            var date = new Date(unix_timestamp * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            
			index_latest = i;
            time_latest = data[i][1];
            time.push(formattedTime);
			ExpiredCO2.push(data[i][2]);
			ExpiredO2.push(data[i][3]);
			mve.push(data[i][4]);
			flowrate.push(data[i][5]);
			pressure.push(data[i][7]);

			time_PREDICT.push(data[i][1]);
			ExpiredCO2_PREDICT.push(null);
			ExpiredO2_PREDICT.push(null);
			mve_PREDICT.push(null);
            pressure_PREDICT.push(null);
		} else {
			// only plot if i>total-delta
			if (i >= data.length - amountPointsInPlot) {
				let unix_timestamp = Number(data[i][1])
                var date = new Date(unix_timestamp * 1000);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                
                index_latest = i;
                time_latest = data[i][1];
                time.push(formattedTime);
                ExpiredCO2.push(data[i][2]);
                ExpiredO2.push(data[i][3]);
                mve.push(data[i][4]);
                flowrate.push(data[i][5]);
                pressure.push(data[i][7]);

                time_PREDICT.push(data[i][1]);
                ExpiredCO2_PREDICT.push(null);
                ExpiredO2_PREDICT.push(null);
                mve_PREDICT.push(null);
                pressure_PREDICT.push(null);
			}
		}

	}

	// predict the time
	//console.log(Number(time_latest));
    
	for (var i = 1; i <= 5; i++) {

        let unix_timestamp = Number(time_latest) + i;
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        
        time.push(formattedTime);
        ExpiredCO2.push(null);
        ExpiredO2.push(null);
        mve.push(null);
        flowrate.push(null);
        pressure.push(null);

        time.push(formattedTime);
		ExpiredCO2_PREDICT.push(Number(data[i][2]));
        ExpiredO2_PREDICT.push(Number(data[i][3]));
        mve_PREDICT.push(Number(data[i][4]));
		pressure_PREDICT.push(Number(data[i][7]));
        
	}
    //console.log(Number(index_latest)-2);
	document.getElementById('CO2').innerHTML = data[index_latest][2];
	document.getElementById('mve').innerHTML = data[index_latest][4];
	document.getElementById('pressure').innerHTML = data[index_latest][7];
	// console.log(ExpiredO2[data.length-2]);

	// CO2 and O2
	var ctx = document.getElementById('myChart').getContext('2d');
	var config = {
        type : 'line',
		axis : {
			x : {
				type : 'timeseries',
			}
		},
		data : {
			labels : time,
			datasets : [ {
				label : 'ExpiredCO2',
				data : ExpiredCO2,
				borderColor : window.chartColors.blue,
				yAxisID : 'y-axis-1',
			},
            {
				label : 'ExpiredCO2_pred',
				data : ExpiredCO2_PREDICT,
				borderColor : window.chartColors.orange,
				yAxisID : 'y-axis-1',
			},
            {
				label : 'ExpiredO2',
				data : ExpiredO2,
				borderColor : window.chartColors.red,
				yAxisID : 'y-axis-2',
			// backgroundColor: 'rgba(0, 119, 204, 0.3)',
			},
            {
				label : 'ExpiredO2_pred',
				data : ExpiredO2_PREDICT,
				borderColor : window.chartColors.orange,
				yAxisID : 'y-axis-2',
			},
            ]
		},
		options : {
            animation: false,
			responsive : true,
			maintainAspectRatio : false,
			scales : {
				yAxes : [ {
					type : 'linear',
					display : true,
					position : 'left',
					id : 'y-axis-1',
				}, {
					type : 'linear',
					display : true,
					position : 'right',
					id : 'y-axis-2',
					gridLines : {
						drawOnChartArea : false,
					},
				} ],
			}
		}
	};
	var chart = new Chart(ctx, config);

	// mve
	var ctx1 = document.getElementById('myChart1').getContext('2d');
	var config1 = {
        type : 'line',
		data : {
			labels : time,
			datasets : [ {
				label : 'MVe',
				data : mve,
				borderColor : window.chartColors.blue,
			}, {
				label : 'MVe_pred',
				data : mve_PREDICT,
				borderColor : window.chartColors.orange,
			// backgroundColor: 'rgba(255, 165, 0, 0.3)',
			} ]
		},
		options : {
            animation: false,
			responsive : true,
			maintainAspectRatio : false,
			scales : {
				yAxes : [ {
					type : 'linear', 
					display : true,
					id : 'y-axis-1',
				}, {
					type : 'linear', 
					display : true,
					position : 'left',
					gridLines : {
						drawOnChartArea : false,
					},
				} ],
			}
		}
	};
	var chart1 = new Chart(ctx1, config1);

	var ctx2 = document.getElementById('myChart2').getContext('2d');
	var config2 = {
        type : 'line',
		data : {
			labels : time,
			datasets : [ {
				label : 'pressure',
				data : pressure,
				borderColor : window.chartColors.blue,
			}, {
				label : 'pressure_pred',
				data : pressure_PREDICT,
				borderColor : window.chartColors.orange,
			// backgroundColor: 'rgba(255, 165, 0, 0.3)',
			} ]
		},
		options : {
            animation: false,
			responsive : true,
			maintainAspectRatio : false,
			scales : {
				yAxes : [ {
					type : 'linear', 
					display : true,
					id : 'y-axis-1',
				}, {
					type : 'linear', 
					display : true,
					position : 'left',
					gridLines : {
						drawOnChartArea : false,
					},
				} ],
			}
		}
	};
	var chart2 = new Chart(ctx2, config2);
}

parseData(createGraph);
