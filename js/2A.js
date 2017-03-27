// define width and height
var scatterWidth = 700;
var scatterHeight = 500;
var scatterPadding = 70;
var xmin = 0;
var xmax = 0;
var ymax = 0;
var xmax = 0;
var crimemax = 0;
var scatterDatasets = {};
var curYear = 2003;

// shortcuts to X and Y 	strings
x_str = 'PROSTITUTION';
y_str = 'VEHICLE THEFT';
std_col = "#2C3E50";

// initialize SVG viewport
var scatterPlot = d3.select("#abb")
	.append("svg")
	.attr("width", scatterWidth)
	.attr("height", scatterHeight);

// add cool tooltip
var tip = d3.tip()
	.attr('class', 'd3-tip')
	.html(function(d) {
			return `
				<p><strong><span> ${d.district.charAt(0) + d.district.slice(1).toLowerCase()} district</strong></p>
				<p>Prostitution: <span> ${d[x_str]} </span></p>
				<p>Vehicle theft: <span> ${d[y_str]} </span></p>
				<p>Total crime in district: <span>${d.total_crime} </span></p>`;
	});
scatterPlot.call(tip);

// add on-click functions to the buttons
d3.select("#btn-2003")
 	.on("click", function() {
 		if (curYear != 2003) {
 			curYear = 2003;
 			changeScatterDataset("2003");
 		}
 	});

d3.select("#btn-2015")
 	.on("click", function() {
 		if (curYear != 2015) {
 			curYear = 2015;
 			changeScatterDataset("2015");
 		}
 	});

// keep the button active
$('#btn-2015').click(function() {
    $('#btn-2003').removeClass('active');
    $('#btn-2015').addClass('active');
});
$('#btn-2003').click(function() {
	$('#btn-2015').removeClass('active');
    $('#btn-2003').addClass('active');
});

// load the initial dataset and draw the plot
d3.json("data/2003.json", function(data) {
	data.sort(function(a, b) {
		return a.district.localeCompare(b.district);
	});
	scatterDatasets["2003"] = data;
	findMinMax(data, initializePlot);
});

function findMinMax(initialData, cb) {
	// inspect the first dataset
	xmin = d3.min(initialData, function(d) { return +d[x_str]; });
	xmax = d3.max(initialData, function(d) { return +d[x_str]; });
	ymin = d3.min(initialData, function(d) { return +d[y_str]; });
	ymax = d3.max(initialData, function(d) { return +d[y_str]; });
	crimemax = d3.max(initialData, function(d) { return +d.total_crime; });

	// inspect the last dataset
	d3.json("data/2015.json", function(data) {
		min_x = d3.min(data, function(d) { return +d[x_str]; });
		max_x = d3.max(data, function(d) { return +d[x_str]; });
		min_y = d3.min(data, function(d) { return +d[y_str]; });
		max_y = d3.max(data, function(d) { return +d[y_str]; });
		max_crime = d3.max(data, function(d) { return +d.total_crime; });

		if (min_x < xmin) { xmin = min_x; }
		if (max_x > xmax) { xmax = max_x; }
		if (min_y < ymin) { ymin = min_y; }
		if (max_y > ymax) { ymax = max_y; }
		if (max_crime > crimemax ) { crimemax = max_crime; }
		cb(initialData);
	});
}

function changeScatterDataset(year) {
	if (!(year in scatterDatasets)) {
		// no dataset for the year has been loaded, load the data!
		d3.json("data/" + year + ".json", function(data) {
			// sort the dataset by district
			data.sort(function(a, b) {
				return a.district.localeCompare(b.district);
			});
			scatterDatasets[year] = data;
			updateScatterPlot(data);
		});
	} else {
		// data has been loaded, just update with the already loaded set
		updateScatterPlot(scatterDatasets[year]);
	}
}

// change the dataset and update the plot
// does _NOT_ append new elements to the viewport.
function updateScatterPlot(dataset) {
	var numVals = dataset.length;
	// define scales
	var xScale = d3.scale.linear()
		.domain([0, xmax])
		.range([scatterPadding, scatterWidth - scatterPadding * 2]);

	var yScale = d3.scale.linear()
		.domain([0, ymax])
		.range([scatterHeight - scatterPadding, scatterPadding]);

	var rScale = d3.scale.linear()
		.domain([0, crimemax])
		.range([1, 12]);

	scatterPlot.selectAll("circle")
		.data(dataset)
		.transition()
		.duration(1000)
			.delay(function(d, i) {
				return i / numVals * 500;
			})
			.attr({
				"cx": function(d) { return xScale(d[x_str]); },
				"cy": function(d) { return yScale(d[y_str]); },
			})
			.each("end", function() {
				d3.select(this)
				.transition()
				.duration(500)
				.attr({
					"r": function(d) { return rScale(d.total_crime); },
				});
			});

	scatterPlot.selectAll("text")
		.data(dataset)
		.transition()
		.duration(1000)
		.delay(function(d, i) {
			return i / numVals * 500;
		})
		.text(function(d) {
			return d.district;
		})
		.attr({
			"x": function(d) { return xScale(d[x_str]) + rScale(d.total_crime)+2 ; },
			"y": function(d) { return yScale(d[y_str]) + rScale(d.total_crime)/2.4; },
			"font-family": "sans-serif",
			"font-size": "11px",
			"fill": "#18BC9C",
		});
	}

// set up the initial plot with dataset loaded.
function initializePlot(dataset) {
	// define scales
	var xScale = d3.scale.linear()
		.domain([0, xmax])
		.range([scatterPadding, scatterWidth - scatterPadding * 2]);

	var yScale = d3.scale.linear()
		.domain([0, ymax])
		.range([scatterHeight - scatterPadding, scatterPadding]);

	var rScale = d3.scale.linear()
		.domain([0, crimemax])
		.range([1, 12]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(5);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(5);

	scatterPlot.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr({
			"cx": function(d) { return xScale(d[x_str]); },
			"cy": function(d) { return yScale(d[y_str]); },
			"r": function(d) { return rScale(d.total_crime); },
			"fill": std_col,
		})
		.on("mouseover", function(d) {
			tip.show(d);
			size = parseFloat(d3.select(this).attr("r"));

			d3.select(this)
				.transition()
				.duration(500)
				.delay(0)
				.ease("elastic")
				.attr({
					"fill": "magenta",
					"r": size*1.25,
			});
		})
		.on("mouseout", function(d) {
			tip.hide(d);
			size = parseFloat(d3.select(this).attr("r"));

			d3.select(this)
				.transition()
				.duration(500)
				.delay(0)
				.ease("elastic")
				.attr({
					"fill": std_col,
					"r": size*0.8,
			});
		});

	scatterPlot.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.text(function(d) {
			return d.district;
		})
		.attr({
			"x": function(d) { return xScale(d[x_str]) + rScale(d.total_crime)+2; },
			"y": function(d) { return yScale(d[y_str]) + rScale(d.total_crime)/2.4; },
			"font-family": "sans-serif",
			"font-size": "11px",
			"fill": "#18BC9C",
		});

	scatterPlot.append("g")
		.attr({
			"class": "axis",
			"transform": "translate(0,"+ (scatterHeight - scatterPadding)+")"
		})
		.call(xAxis);

	scatterPlot.append("g")
		.attr({
			"class": "axis",
			"transform": "translate("+(scatterPadding-10)+",0)"
		})
		.call(yAxis);

	// Add the text label for the x axis
	scatterPlot.append("text")
		.attr("transform", "translate(" + (scatterWidth / 2) + " ," + (scatterHeight - 20) + ")")
		.style("text-anchor", "middle")
		.style("fill", std_col)
		.text("Prostitution");

	// Add the text label for the Y axis
	scatterPlot.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0-2)
		.attr("x",0 - (scatterHeight / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("fill", std_col)
		.text("Vehicle Theft");
}
