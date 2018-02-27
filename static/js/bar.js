function bar(imdb, bechdel, sales){

    console.log(sales);
    
    
// set the dimensions and margins of the graph
var div = "#stacked-bar";
var parentWidth = $(div).parent().width();
var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = parentWidth - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;


var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
var y = d3.scaleLinear()
      .range([height, 0]);


var newYears = d3.nest()
.key(function(d) { return d.year; })
.rollup(function(values) { 
    return d3.mean(values, function(d) {return +d.rating; }) })
.map(bechdel);

var newData = [];

for (const key in newYears) {
    if (newYears.hasOwnProperty(key)) {
        var item = {
            year: key.substr(1),
            avg_rating:newYears[key]
        }
        newData.push(item);     
               
    }
}


console.log(newData);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(div).append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");



      

// format the data
// data.forEach(function(d) {
// d.sales = +d.sales;
// });

// Scale the range of the data in the domains
//x.domain(bechdel.map(function(d) { return d.year; }));
x.domain(newData.map(function (d) { return d.year }));
y.domain([0, 3]);

// append the rectangles for the bar chart
// svg.selectAll(".bar")
//   .data(newData)
// .enter().append("rect")
//   .attr("class", "bar")
//   .attr("x", function(d) { return d.year  })
//   .attr("width", 2)
// .attr("y", function(d) { return y(d.avg_rating); })
//   .attr("height", function(d) { return y(d.avg_rating); });


  svg.selectAll(".rect")
  .data(newData)
  .enter()
  .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.avg_rating); })
      .attr("width", 15)
      .attr("height", function(d) { return height - y(d.avg_rating); });


// add the x Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// add the y Axis
svg.append("g")
  .call(d3.axisLeft(y));





}