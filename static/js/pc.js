function pc(imdb, bechdel, pcData){

this.bechdel = bechdel;
this.imdb = imdb;


let pcChartDiv = '#pc-chart';

var data = pcData;
var countriesArray = [];

var parentWidth = $(pcChartDiv).parent().width();
  var margin = {top: 40, right: 0, bottom: 10, left: 100},
      width = parentWidth - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    
      //dimensions for the axes.
      //Caution: Attributes in the function needs to be changed if  data file is changed
      var dimensions = axesDims(height);
      dimensions.forEach(function(dim) {
        dim.scale.domain(dim.type === "number"
            ? d3.extent(data, function(d) { return +d[dim.name]; })
            : data.map(function(d) { return d[dim.name]; }).sort());
      });
    
      //Tooltip
      var tooltip = d3.select(pcChartDiv).append("div")
           .attr("class", "tooltip")
           .style("opacity", 0);
    
      var line = d3.line()
         .defined(function(d) { return !isNaN(d[1]); });
    
      //Y axis orientation
      var yAxis = d3.axisLeft();
    
      var svg = d3.select(pcChartDiv).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
      /* ~~ Task 6 Scale the x axis ~~*/
      //https://github.com/d3/d3-scale/blob/master/README.md#scaleBand
      //ScaleBand creates a new band scale with empty domain
      // no padding, no rounding, center alignment, unit range[0,1]
      var x = d3.scaleBand()
      .domain(dimensions.map(function (d) { return d.name; }))
      //Domain set the input boundries, .map on the dimensions, runs it once for each in the array
      .range([0, width]);
      //.range sets the output range and starts the x axis at 0 and stops it at the with of the container
    
    
    
    //  /* ~~ Task 7 Add the x axes ~~*/
      var axes = svg.selectAll(".axes")
      .data(dimensions)//Feed in the data from dimensions
      .enter()
      .append("g").attr("class", "dimension")
      .attr("transform", function (d) { 
        return "translate(" + x(d.name) + ")"; });;
    //Set up the axes
    
    //add the text/numbers
      axes.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
        .append("text")
        .attr("class", "title")
        .style('fill','black')
        .style('font-size','9px')
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d.name; });
    
    
        var d3Colors = d3.scaleOrdinal(d3.schemeCategory20);
        //Task 8 initialize color scale
        var cc = []; 
    
       data.forEach(function (d) { 
        //  console.log("From data: "+d["Country"]);
        //  console.log("From color: "+ d3Colors(d["Country"])); 
          cc[d["Country"]] = d3Colors(d["Country"]); //Fill the array with country names and their associated colours
    
        });
    
        // console.log(cc);
        //Add color here
        var background = svg.append("g")
           .attr("class", "background")
           .selectAll("path")
           .data(data)
           .enter().append("path")
           .attr("d", draw);
    
        var foreground = svg.append("g")
           .attr("class", "foreground")
           .selectAll("path")
           .data(data)
           .enter().append("path")
           .attr("d", draw) 
           .style("stroke", function (d) {
             return cc[d["Country"]];//Get the colour by using the country-name as key
           })
    
          
    
    
    
        /* ~~ Task 9 Add and store a brush for each axis. ~~*/
        axes.append("g")
            .attr("class", "brush")
            /* ~~ Add brush here */
            .each(function (d) {
              d3.select(this).call(d.brush = d3.brushY()
                  .extent([[-10, 0], [10, height]])
                  .on("start", brushstart)
                  .on("brush", brush)
                  .on("end", brush))
            })
            .selectAll("rect")
            .attr("x", -10)
            .attr("width", 20);
    
        //Select lines for mouseover and mouseout
        var projection = svg.selectAll(".background path, .foreground path")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
    
    
        function mouseover(d) {
    
          //Only show then active..
          tooltip.transition().duration(200).style("opacity", .9);
          var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
          tooltip.attr(
            "style",
            "left:"+(mouse[0]+30)+
            "px;top:"+(mouse[1]+40)+"px")
            .html(d.Country);
    
          svg.classed("active", true);
    
          // this could be more elegant
          if (typeof d === "string") {
            projection.classed("inactive", function(p) { return p.name !== d; });
            projection.filter(function(p) { return p.name === d; }).each(moveToFront);
    
          } else {
            projection.classed("inactive", function(p) { return p !== d; });
            projection.filter(function(p) { return p === d; }).each(moveToFront);
          }
        }
    
        function mouseout(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          svg.classed("active", false);
          projection.classed("inactive", false);
        }
    
        function moveToFront() {
          this.parentNode.appendChild(this);
        }
    
        function draw(d) {
          return line(dimensions.map(function(dim) {
            return [x(dim.name), dim.scale(d[dim.name])];
          }));
        }
    
        function brushstart() {
          d3.event.sourceEvent.stopPropagation();
        }
    
        // Handles a brush event, toggling the display of foreground lines.
        function brush(d) {
    
          var actives = [];
          svg.selectAll(".dimension .brush")
          .filter(function(d) {
            return d3.brushSelection(this);
          })
          .each(function(d) {
            actives.push({
              dim: d,
              extent: d3.brushSelection(this)
            });
          });
    
          foreground.style("display", function (d) {
              return actives.every(function (active) {
                 var dim = active.dim;
                 var ext = active.extent;
                 var l = within(d, ext, dim);
                 return l;
              }) ? null : "none";
          });
    
          function within(d, extent, dim) {
            var w =  dim.scale(d[dim.name]) >= extent[0]  && dim.scale(d[dim.name]) <= extent[1];
    
            
            if(w){
                /* ~~ Call the other graphs functions to highlight the brushed.~~*/
                // sp.selectDots(w);
                // countriesArray.push(d);
                // console.log(countriesArray);
                // sp.selectDots(countriesArray);
            }
    
            return w;
          };
    
    
        } //Brush
    
        //Select all the foregrounds send in the function as value
        this.selectLine = function(value){
           /* ~~ Select the lines ~~*/
        };
    
        function axesDims(height){
            return [
                {
                  name: "Country",
                  scale: d3.scaleBand().range([0, height]),
                  type: "string"
                },
                {
                  name: "Household_income",
                  scale: d3.scaleLinear().range([0, height]),
                  type: "number"
                },
                {
                  name: "Employment_rate",
                  scale: d3.scaleLinear().range([height, 0]),
                  type: "number"
                },
                {
                  name: "Unemployment_rate",
                  scale: d3.scaleLinear().range([height, 0]),
                  type: "number"
                },
                {
                  name: "Personal_earnings",
                  scale: d3.scaleLinear().range([height, 0]),
                  type: "number"
                },
                {
                  name: "Quality_of_support_network",
                  scale: d3.scaleLinear().range([height, 0]),
                  type: "number"
                },
                {
                  name: "Student_skills",
                  scale: d3.scaleLinear().range([height, 0]),
                  type: "number"
                },
                {
                  name: "Water_quality",
                  scale: d3.scaleLinear().range([height, 0]),
                  type: "number"
                },
                {
                  name: "Voter_turnout",
                  scale: d3.scaleLinear().range([height, 0]),
                  type: "number"
                },
                {
                  name: "Self_reported_health",
                  scale: d3.scaleLinear().range([height, 0]),
                  type: "number"
                },
                {
                  name: "Life_satisfaction",
                  scale: d3.scaleLinear().range([height, 0]),
                  type: "number"
                },
            ];
        }
    }
    
