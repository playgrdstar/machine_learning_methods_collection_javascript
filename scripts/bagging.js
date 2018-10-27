
function bagging() {
let data = generateCategoricalData(20,10,1,5);

console.log(data);


const width = 500, height = 500, margin = 50;

const svg = d3.select('#bagging')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

let scaleX = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(data,d=>d.x1));
let scaleY = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(data,d=>d.x2));

let xAxis = d3.axisBottom();
let yAxis = d3.axisLeft();

xAxis.scale(scaleX).ticks(5);
yAxis.scale(scaleY).ticks(5);

var xAxisGroup = svg.append('g')
                          .attr('class', 'x1 axis')
                          .attr('transform', 'translate(0' + ',' + (height-2*margin) + ')');

var yAxisGroup = svg.append('g')
                          .attr('class', 'x2 axis')
                          .attr('transform', 'translate('+ 2*margin + ',0)');

let title = svg.append('text')
            .attr('x', width/2)
            .attr('y', 0+margin/2)
            .style('text-anchor', 'middle')
            .style('fill', '#DE4E45')
            .style('font-size', '14px')
            .text('Bagging');

let dots = svg.selectAll('dots')
                .data(data);

    dots.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX(d.x1))
                .attr('cy',d=>scaleY(d.x2))
                .attr('r', 3)
                .style('fill', d=>{
                    if(d.y==0){return 'pink'}
                    else if(d.y==1){return '#DE4E45'}
                });

    dots.exit().remove();


xAxisGroup.transition().duration(100).call(xAxis);
yAxisGroup.transition().duration(100).call(yAxis);


data.forEach(d=>{
    if (d.x1<1.9){
        d.group1 = 0;
    } else if (d.x1>1.9){
        d.group1 = 1;
    }
});


data.forEach(d=>{
    if (d.group1==d.y){
        d.error1 = 0;
    } else if (d.group1!=d.y){
        d.error1 = 1;
    }
});


data.forEach(d=>{
    if (d.x2<3.5){
        d.group2 = 0;
    } else if (d.x2>3.5){
        d.group2 = 1;
    }
});

data.forEach(d=>{
    if (d.group2==d.y){
        d.error2 = 0;
    } else if (d.group2!=d.y){
        d.error2 = 1;
    }
});

data.forEach(d=>{
    if (d.x2<4.5){
        d.group3 = 0;
    } else if (d.x2>4.5){
        d.group3 = 1;
    }
});

data.forEach(d=>{
    if (d.group3==d.y){
        d.error3 = 0;
    } else if (d.group3!=d.y){
        d.error3 = 1;
    }
});

data.forEach(d=>{
    d.prediction = mode([d.group1, d.group2, d.group3]);
});

let error = 0;
let correct = 0;

data.forEach(d=>{
    if (d.prediction==d.y){
        correct++;
    } else if (d.prediction!=d.y){
        error++;
    }
});

console.table(data);
console.log('Prediction accuracy', 100*correct/data.length);


let preddots1 = svg.selectAll('dots')
                .data(data);

    preddots1.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX(d.x1))
                .attr('cy',d=>scaleY(d.x2))
                .attr('fill-opacity', 0)
                .attr('r', 5)
                .style('stroke', d=>{
                    if(d.group1==0){return 'pink'}
                    else if(d.group1==1){return '#DE4E45'}
                });

    preddots1.exit().remove();


let preddots2 = svg.selectAll('dots')
                .data(data);

    preddots2.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX(d.x1)+7)
                .attr('cy',d=>scaleY(d.x2))
                .attr('fill-opacity', 0)
                .attr('r', 5)
                .style('stroke', d=>{
                    if(d.group2==0){return 'pink'}
                    else if(d.group2==1){return '#DE4E45'}
                });

    preddots2.exit().remove();

let preddots3 = svg.selectAll('dots')
                .data(data);

    preddots3.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX(d.x1)-7)
                .attr('cy',d=>scaleY(d.x2))
                .attr('fill-opacity', 0)
                .attr('r', 5)
                .style('stroke', d=>{
                    if(d.group3==0){return 'pink'}
                    else if(d.group3==1){return '#DE4E45'}
                });

    preddots3.exit().remove();
}

bagging();