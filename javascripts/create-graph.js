/*
 * Parse the data and create a graph with the data.
 */
function parseData(createGraph) {
	//Papa.parse("../data/spanish-silver.csv", {
	//Papa.parse("../data/spanish-silver-v2.csv", {
	Papa.parse("../data/data.csv", {
		download: true,
		complete: function(results) {
			createGraph(results.data);
		}
	});
}

function createGraph(data) {
	var years = [];
	var graph1 = ["graph1"];
	var graph2 = ["graph2"];
    var amountPointsInPlot = 100
    var index_x = 1
    var index_y_graph1 =2
    var index_y_graph2 =3
	for (var i = 1; i < data.length; i++) {
		if(data[i]==""){break;}
        if(data.length < amountPointsInPlot){
            // always plots
            years.push(data[i][index_x]);
            graph1.push(data[i][index_y_graph1]);
            graph2.push(data[i][index_y_graph2]);
        }
        else{
            // only plot if i>total-delta
            if(i >= data.length - amountPointsInPlot){
                years.push(data[i][index_x]);
                graph1.push(data[i][index_y_graph1]);
                graph2.push(data[i][index_y_graph2]);
           }
        }
	}

	//console.log(years);
	//console.log(graph1);

	var chart = c3.generate({
		bindto: '#chart',
	    data: {
	        columns: [
	        	graph1,graph2
	        ]
	    },
	    axis: {
	        x: {
	            type: 'category',
	            categories: years,
	            tick: {
	            	multiline: false,
                	culling: {
                    	max: 15
                	}
            	}
	        }
	    },
	    zoom: {
        	enabled: true
    	},
	    legend: {
	        position: 'right'
	    }
	});
}

parseData(createGraph);