function main_linregsgd() {
// Generate random data that we can regress against

let linregsgdData = generateContinuousData(50,3,1,3,2);

console.log(linregsgdData);

// Plot random points

const width = 400, height = 400, margin = 25;

const svg = d3.select('#linearRegressionSGD')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

let scaleX = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(linregsgdData,d=>d.x));
let scaleY = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(linregsgdData,d=>d.y));

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

let title = svg.append('text')
            .attr('x', width/2)
            .attr('y', 0+margin/2)
            .style('text-anchor', 'middle')
            .style('fill', '#DE4E45')
            .style('font-size', '14px')
            .text('Linear Regression - SGD');

let dots = svg.selectAll('dots')
                .data(linregsgdData);

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


xAxisGroup.transition().duration(100).call(xAxis);
yAxisGroup.transition().duration(100).call(yAxis);

let errors =[];
let epochs = 10;
let A = 0.0;
let B = 0.0;
let alpha = 0.01;

let count =0;
for (let i=0; i<epochs; i++){
    let error;
    
    linregsgdData.forEach(d=>{

        let predY;
        predY = A*d.x+B;
        
        error = predY-d.y;
        
        tempA = A;
        tempB = B;

        B = tempB - alpha*error;
        A = tempA - alpha*error*d.x;

        // errors.push({error:error, iteration:count});
        count++;
    })

    console.log('A', A, 'B', B);
    console.log('Error', error);

    errors.push({error:error, iteration:i});
}

console.log(errors);


const svg2 = d3.select('#linearRegressionSGDTrain')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

let scaleX2 = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(errors,d=>d.iteration));
let scaleY2 = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(errors,d=>d.error));

let xAxis2 = d3.axisBottom();
let yAxis2 = d3.axisLeft();

xAxis2.scale(scaleX2).ticks(5);
yAxis2.scale(scaleY2).ticks(5);

var xAxisGroup2 = svg2.append('g')
                          .attr('class', 'x axis')
                          .attr('transform', 'translate(0' + ',' + (height-2*margin) + ')');

var yAxisGroup2 = svg2.append('g')
                          .attr('class', 'y axis')
                          .attr('transform', 'translate('+ 2*margin + ',0)');

let errordots = svg2.selectAll('errordots')
                .data(errors);

    errordots.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(errordots)
                .transition()
                .duration(10)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX2(d.iteration))
                .attr('cy',d=>scaleY2(d.error))
                .attr('r', 1)
                .style('fill', 'red');

    errordots.exit().remove();

let errorline = d3.line()
                .x(d=>scaleX2(d.iteration))
                .y(d=>scaleY2(d.error));

svg2.append('path')
    .data([errors])
    .attr('class', 'eline')
    .attr('d',errorline)
    .style('fill', 'none')
    .style('stroke', '#DE4E45')
    .style('stroke-width', '1px')
    .style('stroke-opacity', 0.5);

let title2 = svg2.append('text')
            .attr('x', width/2)
            .attr('y', 0+margin/2)
            .style('text-anchor', 'middle')
            .style('fill', '#DE4E45')
            .style('font-size', '14px')
            .text('Linear Regression - SGD - Training');


xAxisGroup2.transition().duration(100).call(xAxis2);
yAxisGroup2.transition().duration(100).call(yAxis2);

let squaredError = 0;

linregsgdData.forEach(d=>{
    let predY = A*d.x + B;
    d.predY = predY;
    squaredError += (d.predY - d.y)*(d.predY - d.y);
});

squaredError = Math.sqrt(squaredError/linregsgdData.length);
console.log('RMSE', squaredError);

console.log(linregsgdData);

let line = d3.line()
                .x(d=>scaleX(d.x))
                .y(d=>scaleY(d.predY));

svg.append('path')
    .data([linregsgdData])
    .attr('class', 'rline')
    .attr('d',line)
    .style('fill', 'none')
    .style('stroke', '#DE4E45')
    .style('stroke-width', '1px')
    .style('stroke-opacity', 0.5);

}

main_linregsgd();