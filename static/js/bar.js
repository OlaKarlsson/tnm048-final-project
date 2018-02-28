function bar(imdb, bechdel){

    
    
// set the dimensions and margins of the graph
var div = "#stacked-bar";
var parentWidth = $(div).parent().width();
var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = parentWidth - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
var y = d3.scaleLinear()
      .range([height, 0]);

     
//Resources for d3.nest()
//bl.ocks.org/shancarter/raw/4748131/
//https://bl.ocks.org/ProQuestionAsker/60e7a6e3117f9f433ef9c998f6c776b6
//https://stackoverflow.com/questions/37172184/rename-key-and-values-in-d3-nest

var newData = d3.nest()
.key(function(d) { return d.year; })
.rollup(function(values) {
    return {
        avgRating: d3.mean(values, function(d) {return +d.rating; }),
        ratingCount: values.length      
    };
})
.entries(bechdel)
.map(function(group){
    return {
        year:group.key,
        avgRating: group.value.avgRating,
        count: group.value.ratingCount
    }
});



console.log(newData);
var filterTreshold = 20;
var filteredData = newData.filter(function(d){
    return d.count > filterTreshold;
})

console.log(filteredData);


// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(div).append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");


var div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);
      

// format the data
// data.forEach(function(d) {
// d.sales = +d.sales;
// });

// Scale the range of the data in the domains
//x.domain(bechdel.map(function(d) { return d.year; }));
x.domain(filteredData.map(function (d) { return d.year }));
y.domain([0, 3]);



  svg.selectAll(".bar")
  .data(filteredData)
  .enter()
  .append("rect")
      .attr("class", "bar")
      .attr("id", function(d){ return "bar-" + d.year})
      .attr("title", function(d){ return "bar-" + d.year})
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.avgRating); })
      .attr("width", x.bandwidth)
      .attr("height", function(d) { return height - y(d.avgRating); })
    .on("mouseover", function(d) {
    div.transition()
        .duration(200)
        .style("opacity", .9);
    div.html("Year: " + d.year + "<br/>" + "Avg rating: " +d.avgRating.toFixed(1)+ "<br/>" + "Count: " +d.count)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
    div.transition()
        .duration(500)
        .style("opacity", 0);
    });


// add the x Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// add the y Axis
svg.append("g")
  .call(d3.axisLeft(y));





}