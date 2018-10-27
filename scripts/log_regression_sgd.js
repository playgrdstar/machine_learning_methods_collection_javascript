function main_logreg() {
let logregData = generateCategoricalData(50,25,1,30);

console.log(logregData);


const width = 400, height = 400, margin = 25;

const svg = d3.select('#logRegression')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

let scaleX1 = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(logregData,d=>d.x1));
let scaleX2 = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(logregData,d=>d.x2));

let x1Axis = d3.axisBottom();
let x2Axis = d3.axisLeft();

x1Axis.scale(scaleX1).ticks(5);
x2Axis.scale(scaleX2).ticks(5);

var x1AxisGroup = svg.append('g')
                          .attr('class', 'x1 axis')
                          .attr('transform', 'translate(0' + ',' + (height-2*margin) + ')');

var x2AxisGroup = svg.append('g')
                          .attr('class', 'x2 axis')
                          .attr('transform', 'translate('+ 2*margin + ',0)');

let title = svg.append('text')
            .attr('x', width/2)
            .attr('y', 0+margin/2)
            .style('text-anchor', 'middle')
            .style('fill', '#DE4E45')
            .style('font-size', '14px')
            .text('Log Regression - SGD');

let dots = svg.selectAll('dots')
                .data(logregData);

    dots.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX1(d.x1))
                .attr('cy',d=>scaleX2(d.x2))
                .attr('r', 2)
                .style('fill', d=>{
                    if(d.y==0){return 'pink'}
                    else if(d.y==1){return '#DE4E45'}
                });

    dots.exit().remove();


x1AxisGroup.transition().duration(100).call(x1Axis);
x2AxisGroup.transition().duration(100).call(x2Axis);

let errors =[];
let epochs = 500;
let A = 0.0;
let B = 0.0;
let C = 0.0;
let alpha = 0.01;

let count =0;
for (let i=0; i<epochs; i++){
    let error;
    
    logregData.forEach(d=>{

        let predY;
        let func;
        func = A*d.x1+B*d.x2+C;
        predY = 1/(1+Math.exp(-func));
        error = predY - d.y;
        tempA = A;
        tempB = B;
        tempC = C;

        A = tempA - alpha*error*predY*(1-predY)*d.x1;
        B = tempB - alpha*error*predY*(1-predY)*d.x2;
        C = tempC - alpha*error*predY*(1-predY)*1.0;
        
        // errors.push({error:error, iteration:count});
        // count++;
    })

    // console.log('A', A, 'B', B, 'C', C);
    // console.log('Error', error);
    errors.push({error:error, epoch:i});
}

console.log(errors);


const svg2 = d3.select('#logRegressionSGDTrain')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

let escaleX = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(errors,d=>d.epoch));
let escaleY = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(errors,d=>d.error));

let exAxis = d3.axisBottom();
let eyAxis = d3.axisLeft();

exAxis.scale(escaleX).ticks(5);
eyAxis.scale(escaleY).ticks(5);

var xAxisGroup2 = svg2.append('g')
                          .attr('class', 'x axis')
                          .attr('transform', 'translate(0' + ',' + (height-2*margin) + ')');

var yAxisGroup2 = svg2.append('g')
                          .attr('class', 'y axis')
                          .attr('transform', 'translate('+ 2*margin + ',0)');

let title2 = svg2.append('text')
            .attr('x', width/2)
            .attr('y', 0+margin/2)
            .style('text-anchor', 'middle')
            .style('fill', '#DE4E45')
            .style('font-size', '14px')
            .text('Log Regression - SGD - Training');


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
                .attr('cx',d=>escaleX(d.epoch))
                .attr('cy',d=>escaleY(d.error))
                .attr('r', 1)
                .style('fill', 'red');

    errordots.exit().remove();

let errorline = d3.line()
                .x(d=>escaleX(d.epoch))
                .y(d=>escaleY(d.error));

svg2.append('path')
    .data([errors])
    .attr('class', 'eline')
    .attr('d',errorline)
    .style('fill', 'none')
    .style('stroke', 'pink')
    .style('stroke-width', '1px')
    .style('stroke-opacity', 0.3);


xAxisGroup2.transition().duration(100).call(exAxis);
yAxisGroup2.transition().duration(100).call(eyAxis);

let correct = 0;

logregData.forEach(d=>{
    let func, predY;
    func = A*d.x1+B*d.x2+C;
    predY = 1/(1+Math.exp(-func));
    if (predY<0.6){d.predY=0;}
    else if (predY>0.6){d.predY=1;};

    if (d.predY==d.y){correct++};
});

let accuracy = 100*correct/logregData.length
console.log('Accuracy', accuracy, '%');

console.log(logregData);

let preddots = svg.selectAll('dots')
                .data(logregData);

    preddots.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX1(d.x1))
                .attr('cy',d=>scaleX2(d.x2))
                .attr('fill-opacity', 0)
                .attr('r', 5)
                .style('stroke', d=>{
                    if(d.predY==0){return 'pink'}
                    else if(d.predY==1){return '#DE4E45'}
                });

    preddots.exit().remove();
}

main_logreg();
