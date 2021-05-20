// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data/data.csv
d3.csv("assets/data/data.csv").then(function(censusData){
    console.log(censusData);
    // Log a list of state abbrs
    const abbrs= censusData.map(data=>+data.abbr);
    console.log (abbrs);
    // log Lacks healthcare and in poverty
    const healthcareLacks=censusData.map(data => +data.healthcare);
    console.log (healthcareLacks);
    const inPoverty=censusData.map(data => +data.poverty);
    console.log (inPoverty);
    // log age median and smokes percentage
    const ageMedian=censusData.map(data => +data.age);
    console.log (ageMedian);
    const smokesPct=censusData.map(data => +data.smokes);
    console.log (smokesPct);
    // log obesity percentage and median household income
    const obesePct=censusData.map(data => +data.obesity);
    console.log (obesePct);
    const incomeMedian=censusData.map(data => +data.income);
    console.log (incomeMedian);
    scatterPlot(inPoverty,healthcareLacks);

    // d3.extent returns the an array containing the min and max values for the property specified
    var xLinearScale = d3.scaleLinear().nice()
    .domain(d3.extent(inPoverty))
    .range([0, chartWidth]);

    // Configure a linear scale with a range between the chartHeight and 0
    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(healthcareLacks)).nice()
    .range([chartHeight, 0]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Configure a line function which will plot the x and y coordinates using our scales
    var drawLine = d3.line()
    .x(data => xLinearScale(data.date))
    .y(data => yLinearScale(data.force));

});
// function to update scatter plot
function scatterPlot (x,y) {
    const data =[{
        x:x,
        y:y,
        mode:'markers',
        marker: {
            size: Array.from({length: 50}, (_, i) => (1**i*10))
        }
    }];
    Plotly.newPlot('scatter',data);
};