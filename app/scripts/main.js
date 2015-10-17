"use strict";

// var width = 900,
//     height = 500;

var margin = {top: 10, left: 10, bottom: 10, right: 10},
    width = parseInt(d3.select("#svg").style("width")),
    width = width - margin.left - margin.right,
    mapRatio = 0.5,
    height = width * mapRatio;   

var projection = d3.geo.albersUsa()
    .scale(width) //.scale(width * 1.1)
    .translate([width / 2, height / 2]);  

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#svg").append("svg")
    .attr("class", "myChart")
    .attr("width", width)
    .attr("height", height);

var tooltip = {
    element: null,
    init: function() {
        this.element = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    },
    show: function(t) {
        this.element.html(t).transition().duration(200).style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY - 20 + "px").style("opacity", 0.9);
    },
    move: function() {
        this.element.transition().duration(30).ease("linear").style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY - 20 + "px").style("opacity", 0.9);
    },
    hide: function() {
        this.element.transition().duration(500).style("opacity", 0);
    }};

tooltip.init();

var numFormat = d3.format(",d");


function ready (error, data, data1) {

  // console.log(d3.min(data1, function(d) { return +d.sales; }));
  // console.log(d3.max(data1, function(d) { return +d.sales; }));

  var min = d3.min(data1, function(d) { return +d.sales; });
  var max = d3.max(data1, function(d) { return +d.sales; });

  var rateById = {};

  data1.forEach(function(d) { rateById[d.state] = +d.sales; });

  //console.log(JSON.stringify(data1));

  //console.log(JSON.stringify(rateById));

  // var min = d3.min(data1, function(d) { return +d["HD01_VD01"]; });
  // var max = d3.max(data1, function(d) { return +d["HD01_VD01"]; });

  var colorScale = d3.scale.linear()
    .domain([min, max]) //568158 37691912
    .range(["#c6dbef","#084594"]);
    //.domain([800000, 2000000, 3300000, 5000000, 7000000, 10000000, 20000000]) 
    //.range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
    //.range(colorbrewer.YlGn["5"]);
    //.range(["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"]);

// var color = d3.scale.linear()
//     .domain([min, max])
//     .range(["darkred", "steelblue"]);


  //console.log(colorScale(800));

  //colorbrewer.Greens["9"]

  //formatValue = d3.format(".2s");
  //var formatValue = d3.format("s");

   

  //var formatNumber = d3.format(",.0f");



  var map = svg.append("g")
      .attr("class", "states");

  var states = map.selectAll("path")
      .data(topojson.feature(data, data.objects.collection).features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.properties.state; })
      .style("fill", function(d) {  return colorScale(rateById[d.properties.state]); })
      .attr("d", path);

      // states.on("mouseover", function (d, i) {
      //     //console.log(this)
      //     tooltip.show("<b>" + d.properties.state  + "</b>" + "<br>" + "Salses: " + rateById[d.properties.state]);    
      //     //toGreyExcept(this);
      // });

      states.on("click", function (d) {
          //console.log(this)
          tooltip.show("<b>" + d.properties.name  + "</b>" + "<br>" + "Salses: " + numFormat(rateById[d.properties.state]));    
          //toGreyExcept(this);
      });

      states.on("mousemove", function () {   
          //tooltip.move();
          })
          .on("mouseout", function () {
          //createStuff();
          tooltip.hide();
      }); 

      // .append("title")
      //   .text(function(d, i) { return d.properties.name + ": " + formatNumber(rateById[d.id]); });

  map.append("path")
      .datum(topojson.mesh(data, data.objects.collection, function(a, b) { return a !== b; }))
      .attr("d", path)
      .attr("class", "subunit-boundary");        



  

  function resize() {
      // adjust things when the window size changes
      width = parseInt(d3.select("#svg").style("width"));
      width = width - margin.left - margin.right;
      height = width * mapRatio;

      // update projection
      projection
          .translate([width / 2, height / 2])
          .scale(width);

      // resize the map container
      map
          .style("width", width + "px")
          .style("height", height + "px");

      // resize the map
      map.select(".subunit-boundary").attr("d", path);
      map.selectAll(".subunit").attr("d", path);
  }    

  d3.select(window).on("resize", resize);
}


  queue()
    .defer(d3.json, "usa4.topo.json")
    //.defer(d3.csv, "population.csv")
    //.defer(d3.csv, "usa.csv")
    .defer(d3.json, "sales.json")
    .await(ready);




