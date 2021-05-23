// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var margin = {
  top: 30,
  right: 30,
  bottom: 90,
  left: 90
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("class","chart")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
var radiusState=10;

// Initial Params
let chosenXAxis="poverty";
let chosenYAxis="obesity";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // d3.extent returns the an array containing the min and max values for the property specified
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData.map(d => d[chosenXAxis])))
        .range([0, chartWidth])
        .nice(); // round up decimals
    return xLinearScale
};

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
    // d3.extent returns the an array containing the min and max values for the property specified
    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData.map(d => d[chosenYAxis])))
        .range([chartHeight,0])
        .nice(); // round up decimals
    return yLinearScale
};

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, newYScale,chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}
function renderAbbrs(stateTextGroup, newXScale, newYScale,chosenXAxis, chosenYAxis) {
    stateTextGroup.transition()
      .duration(1000)
      .attr("x", (d=>newXScale(d[chosenXAxis])))  // Location of x
      .attr("y", (d=>newYScale(d[chosenYAxis])+5));  // Location of y
    return stateTextGroup;
}

// function used for updating stateTextgroup with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, stateTextGroup) {
    var xLabel;
    if (chosenXAxis == "poverty") {
      xLabel = "In Povery (%)";
    } else if(chosenXAxis == "age") {
      xLabel = "Age (Median)";
    } else {
      xLabel = "Household Income (Median)";  
    }

    var yLabel;
    if (chosenYAxis == "obesity") {
      yLabel = "Obesity (%)";
    } else if(chosenYAxis == "smokes") {
      yLabel = "Smokes (%)";
    } else if(chosenYAxis == "healthcare") {
      yLabel = "Lacks Healthcare (%)";  
    }
    // Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([40, -80])
      .html(d => `${d.state} <br>------------<br> ${xLabel}: ${d[chosenXAxis]}<br> ${yLabel}: ${d[chosenYAxis]}`);
  
    // Create the tooltip in chartGroup.
    stateTextGroup.call(toolTip);
    // Create "mouseover" event listener to display tooltip and add gray border to the circle
    stateTextGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
        chartGroup.selectAll('.tempCircle')
            .data("1")
            .enter()
            .append("circle")
            .attr("cx", d3.select(this).attr("x"))  // Returns scaled circle x
            .attr("cy", d3.select(this).attr("y")-5)  // Returns scaled circle y
            .attr("r", 10)  // Radius
            .style("stroke", "gray")
            .style("stroke-width", 2)
            .style("fill","none")
            .classed("tempCircle",true);
    })
    // Create "mouseout" event listener to hide tooltip, and the gray border
        .on("mouseout", function(d) {
            toolTip.hide(d);
            d3.selectAll('.tempCircle').remove();
        });
    return stateTextGroup;
}

// Load d from data/data.csv
d3.csv("assets/data/data.csv").then(function(censusData){
    censusData.forEach(function(d){
        d.poverty=+d.poverty;
        d.age=+d.age;
        d.smokes=+d.smokes;
        d.income=+d.income;
        d.healthcare=+d.healthcare;
        d.obesity=+d.obesity;
    });

    // xLinearScale and yLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    yAxis=chartGroup.append("g")
        .call(leftAxis);
    xAxis=chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Add circles from data
    var circlesGroup=chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d=>xLinearScale(d[chosenXAxis]))  // Returns scaled circle x
        .attr("cy", d=>yLinearScale(d[chosenYAxis]))  // Returns scaled circle y
        .attr("r", radiusState)  // Radius
        .attr("class", "stateCircle");

    // Add statText Labels
    let stateTextGroup=chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .text(d=>d.abbr) // display the state abbr
        .attr("x", (d=>xLinearScale(d[chosenXAxis])))  // Location of x
        .attr("y", (d=>yLinearScale(d[chosenYAxis])+5))  // Location of y
        .attr("class","stateText")
        .attr("font-size", radiusState);

    // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .classed("aText",true)
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");
    
    // Create group for three y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .classed("aText",true)
        .attr("transform", "rotate(-90)");
    var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .attr("dy", "1em")
        .text("obesity (%)");
    var smokesLabel = yLabelsGroup.append("text")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .attr("dy", "1em")
        .text("Smokes (%)");
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .attr("dy", "1em")
        .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    stateTextGroup = updateToolTip(chosenXAxis,chosenYAxis, stateTextGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text").on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
            // replaces chosenXAxis with value
            chosenXAxis = value;
            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(censusData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles and Abbrs with new x y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);
            stateTextGroup=renderAbbrs(stateTextGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            stateTextGroup = updateToolTip(chosenXAxis,chosenYAxis, stateTextGroup);

            // changes classes to change bold text
            if (chosenXAxis == "poverty") {
                povertyLabel
                .classed("active", true)
                .classed("inactive", false);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenXAxis == "age") {
                ageLabel
                .classed("active", true)
                .classed("inactive", false);
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenXAxis == "income") {
                incomeLabel
                .classed("active", true)
                .classed("inactive", false);
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
            }
        }
    });
    // y axis labels event listener
    yLabelsGroup.selectAll("text").on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
            // replaces chosenYAxis with value
            chosenYAxis = value;
            // functions here found above csv import
            // updates y scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles and Abbrs with new x y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);
            stateTextGroup=renderAbbrs(stateTextGroup, xLinearScale, yLinearScale,chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            stateTextGroup = updateToolTip(chosenXAxis,chosenYAxis, stateTextGroup);

            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
                obesityLabel
                .classed("active", true)
                .classed("inactive", false);
                smokesLabel
                .classed("active", false)
                .classed("inactive", true);
                healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenYAxis === "smokes") {
                smokesLabel
                .classed("active", true)
                .classed("inactive", false);
                obesityLabel
                .classed("active", false)
                .classed("inactive", true);
                healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenYAxis === "healthcare") {
                healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
                obesityLabel
                .classed("active", false)
                .classed("inactive", true);
                smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            };
        };
    });
}).catch(function(error) {
console.log(error);
});