// Load data from data/data.csv
d3.csv("assets/data/data.csv").then(function(censusData){
    console.log(censusData);
    // Log a list of state abbrs
    const abbrs= censusData.map(data=>data.abbr);
    console.log (abbrs);
    // log Lacks healthcare and in poverty
    const healthcareLacks=censusData.map(data => data.healthcare);
    console.log (healthcareLacks);
    const inPoverty=censusData.map(data => data.poverty);
    console.log (inPoverty);
    // log age median and smokes percentage
    const ageMedian=censusData.map(data => data.age);
    console.log (ageMedian);
    const smokesPct=censusData.map(data => data.smokes);
    console.log (smokesPct);
    // log obesity percentage and median household income
    const obesePct=censusData.map(data => data.obesity);
    console.log (obesePct);
    const incomeMedian=censusData.map(data => data.income);
    console.log (incomeMedian);
    scatterPlot(inPoverty,healthcareLacks);
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