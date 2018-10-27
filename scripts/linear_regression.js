
function main_linreg() {
// Generate random data that we can regress against

let linregData = generateContinuousData(50,3,1,3,2);

console.log(linregData);

// Plot random points

const width = 400, height = 400, margin = 25;

const svg = d3.select('#linearRegression')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

let scaleX = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(linregData,d=>d.x));
let scaleY = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(linregData,d=>d.y));

let xAxis = d3.axisBottom();
let yAxis = d3.axisLeft();

xAxis.scale(scaleX).ticks(5);
yAxis.scale(scaleY).ticks(5);

var xAxisGroup = svg.append('g')
                          .attr('class', 'x axis')
                          .attr('transform', 'translate(0' + ',' + (height-2*margin) + ')');

var yAxisGroup = svg.append('g')
                          .attr('class', 'y axis')
                          .attr('transform', 'translate('+ 2*margin + ',0)');

let dots = svg.selectAll('dots')
                .data(linregData);

    dots.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX(d.x))
                .attr('cy',d=>scaleY(d.y))
                .attr('r', 2)
                .style('fill', '#DE4E45')
                .style('fill-opacity', 0.5);

    dots.exit().remove();

let title = svg.append('text')
            .attr('x', width/2)
            .attr('y', 0+margin/2)
            .style('text-anchor', 'middle')
            .style('fill', '#DE4E45')
            .style('font-size', '14px')
            .text('Linear Regression - Analytical');
    


xAxisGroup.transition().duration(100).call(xAxis);
yAxisGroup.transition().duration(100).call(yAxis);

let meanX = d3.mean(linregData,d=>d.x);
let meanY = d3.mean(linregData,d=>d.y);
console.log('Means', meanX, ',', meanY); 

let numerator = 0;
let denominator = 0;

linregData.forEach(d=>{
    numerator = numerator + (d.y-meanY)*(d.x-meanX);
    denominator = denominator + (d.x-meanX)*(d.x-meanX);
});

console.log('Numerator', numerator);
console.log('Denominator', denominator);

let A = numerator/denominator;

console.log('A', A);

let B = meanY - A*meanX;

console.log('B', B);

let squaredError = 0;

linregData.forEach(d=>{
    let predY = A*d.x + B;
    d.predY = predY;
    squaredError += (d.predY - d.y)*(d.predY - d.y);
});

squaredError = Math.sqrt(squaredError/linregData.length);
console.log('RMSE', squaredError);

console.log(linregData);

let line = d3.line()
                .x(d=>scaleX(d.x))
                .y(d=>scaleY(d.predY));

svg.append('path')
    .data([linregData])
    .attr('class', 'rline')
    .attr('d',line)
    .style('fill', 'none')
    .style('stroke', '#DE4E45')
    .style('stroke-width', '1px')
    .style('stroke-opacity', 0.5);

let corr = sampleCorrelation(linregData.map(d=>d.x), linregData.map(d=>d.y)).toFixed(2);
let stdevX = standardDeviation(linregData.map(d=>d.x)).toFixed(2);
let stdevY = standardDeviation(linregData.map(d=>d.y)).toFixed(2);
console.log('Correlation',corr);
console.log('Std Dev X', stdevX);
console.log('Std Dev Y', stdevY);

let A_ = (corr * stdevY/stdevX).toFixed(2);

console.log('A', A_);
}

main_linreg();
