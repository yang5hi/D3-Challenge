// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var margin = {
  top: 30,
  right: 30,
  bottom: 60,
  left: 60
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

// Load d from data/data.csv
d3.csv("assets/data/data.csv").then(function(census){
    console.log(census);
    // Log a list of state abbrs
    const abbrs= census.map(d=>d.abbr);
    console.log (abbrs);
    // log Lacks healthcare and in poverty
    const healthcareLacks=census.map(d => +d.healthcare);
    console.log (healthcareLacks);
    const inPoverty=census.map(d => +d.poverty);
    console.log (inPoverty);
    // log age median and smokes percentage
    const ageMedian=census.map(d => +d.age);
    console.log (ageMedian);
    const smokesPct=census.map(d => +d.smokes);
    console.log (smokesPct);
    // log obesity percentage and median household income
    const obesePct=census.map(d => +d.obesity);
    console.log (obesePct);
    const incomeMedian=census.map(d => +d.income);
    console.log (incomeMedian);

    // d3.extent returns the an array containing the min and max values for the property specified
    var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(census.map(d => +d.poverty)))
    .range([0, chartWidth])
    .nice(); // round up decimals

    // Configure a linear scale with a range between the chartHeight and 0
    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(census.map(d => +d.healthcare)))
    .range([chartHeight, 0])
    .nice(); // round up decimals

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
    var leftAxis = d3.axisLeft(yLinearScale);
    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g")
    .call(leftAxis);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    // Add circles from d
    var circlesGroup=chartGroup.selectAll("circle")
        .data(census)
        .enter()
        .append("circle")
        .attr("r", 12)  // Radius
        .attr("cx", (d=>xLinearScale(+d.poverty)))  // Returns scaled circle x
        .attr("cy", (d=>yLinearScale(+d.healthcare)))  // Returns scaled circle y
        .style("stroke", "gray")
        .attr("fill","steelblue")
        .attr("opacity", "0.5")
        .attr("stroke-width", "2");

    // Add Text Labels
    chartGroup.selectAll("text")
        .data(census)
        .enter()
        .append("text")
        .text(d=>d.abbr) // display the state abbr
        .attr("x", (d=>xLinearScale(+d.poverty)-7))  // Location of x
        .attr("y", (d=>yLinearScale(+d.healthcare)+5))  // Location of y
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("fill","gray");

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, 60])
    .html(d=>`${d.state} <br>x_lable ${d.poverty} x_unit <br>y_label ${d.healthcare} y_unit`);

  // Step 2: Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

  // Step 3: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
  // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

    }).catch(function(error) {
console.log(error);
});
