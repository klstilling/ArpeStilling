// global variables
var w = 500;
var h = 500;
var scale= 155000;
var kmeans_data; // Global data variable
var colors = ["Blue", "Red", "Green", "Yellow", "Violet", "Maroon"];
var projection;
var current_kmeans = 2;
var old_kmeans = 2;
var centroids_data;
var kmeans;
var centroids;

//Create SVG element
var svg = d3.select("#ab")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

svg.append("text")
 .attr("x",0)
 .attr("y",50)
 .attr("fill", "black")
 .attr("font-family", "sans-serif")
 .attr("font-size", "40px")
 .text(function(){
    return "San Francisco";     
 });

//Load in GeoJSON data
function load_geo_data(argument) {
  "use strict";
  d3.json("data/sfpd_geo.json", function(json) {
     var center = d3.geo.centroid(json);

    //projection
    // Values are chosen along with scale to fit webpage
    projection = d3.geo.mercator()
          .translate([w*1.3, h*1.05])
          .scale(scale)
          .center(center);

    //path
    var path = d3.geo.path()
        .projection(projection);

    path.projection(projection);

    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#000")
        .style("stroke-width", "1")
        .style("fill", "rgb(186,228,179)");

    load_cluster_data();
  });
}

// Loads the cluster data
function load_cluster_data() {
    // Load the dataset for 2003 and start visualizations
    "use strict";
    d3.csv("data/kmeans/clusters.csv", function(data1) {
      kmeans_data = data1;
      d3.json("data/kmeans/centroids.json", function(data2) {
        centroids_data = data2;
        generate_circles();
      });
    });
}

// Init circles in plot
function generate_circles() {
  // We group into two categories
  kmeans = svg.append("g");
  centroids = svg.append("g");

  // Regular data points
  kmeans.selectAll("circle")
      .data(kmeans_data)
      .enter()
      .append("circle")
      .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", 3)
      .style("fill", function(d) { return colors[parseInt(d.k2)]; });

  // Centroids
  centroids.selectAll("circle")
      .data(centroids_data["k2"])
      .enter()
      .append("circle")
      .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", 10)
      .style("stroke", "#000")
      .style("stroke-width", 2)
      .style("fill", function(d) {return colors[parseInt(d.class)]; });
};

//On click, update data
d3.select("#kmeans2")
	.on("click", function() {
		old_kmeans = current_kmeans;
		current_kmeans = 2;
		updatePlot(current_kmeans);
});

d3.select("#kmeans3")
	.on("click", function() {
		old_kmeans = current_kmeans;
		current_kmeans = 3;
		updatePlot(current_kmeans);
});

d3.select("#kmeans4")
	.on("click", function() {
		old_kmeans = current_kmeans;
		current_kmeans = 4;
		updatePlot(current_kmeans);
});

d3.select("#kmeans5")
	.on("click", function() {
		old_kmeans = current_kmeans;
		current_kmeans = 5;
		updatePlot(current_kmeans);
});

d3.select("#kmeans6")
	.on("click", function() {
		old_kmeans = current_kmeans;
		current_kmeans = 6;
		updatePlot(current_kmeans);
});

// Updates the vis depending on the value of kmeans
function updatePlot(le_number) {
  switch(le_number) {
    case 2:
      // Update dots/circles
      kmeans.selectAll("circle")
      .data(kmeans_data)
      .style("fill", function(d) { return colors[parseInt(d.k2)]; });  // Change color

      centroids.selectAll("circle").remove();
      centroids.selectAll("circle")
      .data(centroids_data["k2"])
      .enter()
      .append("circle")
      .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", 10)
      .style("stroke", "#000")
      .style("stroke-width", 2)
      .style("fill", function(d) {return colors[d.class];});
      break;
    case 3:
      // Update dots/circles
      kmeans.selectAll("circle")
      .data(kmeans_data)
      .style("fill", function(d) { return colors[parseInt(d.k3)]; });

      centroids.selectAll("circle").remove();
      centroids.selectAll("circle")
      .data(centroids_data["k3"])
      .enter()
      .append("circle")
      .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", 10)
      .style("stroke", "#000")
      .style("stroke-width", 2)
      .style("fill", function(d) {return colors[d.class];});
      break;
    case 4:
      // Update dots/circles
      kmeans.selectAll("circle")
      .data(kmeans_data)
      .style("fill", function(d) { return colors[parseInt(d.k4)]; });

      centroids.selectAll("circle").remove();

      centroids.selectAll("circle")
      .data(centroids_data["k4"])
      .enter()
      .append("circle")
      .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", 10)
      .style("stroke", "#000")
      .style("stroke-width", 2)
      .style("fill", function(d) {return colors[d.class];});

      break;
    case 5:
      // Update dots/circles
      kmeans.selectAll("circle")
      .data(kmeans_data)
      .style("fill", function(d) { return colors[parseInt(d.k5)]; });

      centroids.selectAll("circle").remove();

      centroids.selectAll("circle")
      .data(centroids_data["k5"])
      .enter()
      .append("circle")
      .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", 10)
      .style("stroke", "#000")
      .style("stroke-width", 2)
      .style("fill", function(d) {return colors[d.class];});
      break;
    case 6:
      // Update dots/circles
      kmeans.selectAll("circle")
      .data(kmeans_data)
      .style("fill", function(d) { return colors[parseInt(d.k6)]; });

      centroids.selectAll("circle").remove();

      centroids.selectAll("circle")
      .data(centroids_data["k6"])
      .enter()
      .append("circle")
      .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", 10)
      .style("stroke", "#000")
      .style("stroke-width", 2)
      .style("fill", function(d) {return colors[d.class];});
      break;
    default:
  }
}

// Preview when hovering and add the active effect for the buttons click
// Uses jquery syntax, where we call our d3 functions instead of the d3 syntax
$("#kmeans2").on({
    mouseenter: function () {
        updatePlot(2);
    },
    mouseleave: function () {
        updatePlot(current_kmeans);
    },
    click: function () {
        temp_string = "#kmeans" + old_kmeans;
        $(temp_string).removeClass('active');
        $("#kmeans2").addClass('active');
    }
});
$("#kmeans3").on({
    mouseenter: function () {
        updatePlot(3);
    },
    mouseleave: function () {
        updatePlot(current_kmeans);
    },
    click: function () {
        temp_string = "#kmeans" + old_kmeans;
        $(temp_string).removeClass('active');
        $("#kmeans3").addClass('active');
    }
    
});
$("#kmeans4").on({
    mouseenter: function () {
        updatePlot(4);
    },
    mouseleave: function () {
        updatePlot(current_kmeans);
    },
    click: function () {
        temp_string = "#kmeans" + old_kmeans;
        $(temp_string).removeClass('active');
        $("#kmeans4").addClass('active');
    }
});
$("#kmeans5").on({
    mouseenter: function () {
        updatePlot(5);
    },
    mouseleave: function () {
        updatePlot(current_kmeans);
    },
    click: function() {
        temp_string = "#kmeans" + old_kmeans;
        $(temp_string).removeClass('active');
        $("#kmeans5").addClass('active');
    }
});
$("#kmeans6").on({
    mouseenter: function () {
        updatePlot(6);
    },
    mouseleave: function () {
        updatePlot(current_kmeans);
    },
    click: function() {
        temp_string = "#kmeans" + old_kmeans;
        $(temp_string).removeClass('active');
        $("#kmeans6").addClass('active');
    }
});

// Start the main function
load_geo_data();
