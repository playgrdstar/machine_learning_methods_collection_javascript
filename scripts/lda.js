function lda(){


let data = generateCategoricalData(30,15,1,5);

console.log(data);

const width = 400, height = 400, margin = 25;

const svg = d3.select('#lda')
                .append('svg')
                .attr('width',width)
                .attr('height',height);

let scaleX = d3.scaleLinear().range([2*margin,width-2*margin]).domain(d3.extent(data,d=>d.x1));
let scaleY = d3.scaleLinear().range([height-2*margin,2*margin]).domain(d3.extent(data,d=>d.y));

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
            .text('Linear Discriminant Analysis');

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
                .attr('cy',d=>scaleY(d.y))
                .attr('r', 2)
                .style('fill', d=>{
                    if(d.y==0){return 'pink'}
                    else if(d.y==1){return '#DE4E45'}
                });

    dots.exit().remove();


xAxisGroup.transition().duration(100).call(xAxis);
yAxisGroup.transition().duration(100).call(yAxis);

let mean1=0;
let mean2=0;
let count1=0; 
let count2=0;

data.forEach(d=>{
    if (d.y==0){
        mean1+=d.x1;
        count1++;
    }
    else if(d.y==1){
        mean2+=d.x1;
        count2++;
    }
});

mean1 = mean1/count1;
mean2 = mean2/count2;

console.log('Means', mean1,mean2);

let p0 = count1/(count1+count2);
let p1 = count2/(count1+count2);

console.log(p0,p1);

let sumSquares1 = 0;
let sumSquares2 = 0;

data.forEach(d=>{
    if (d.y==0){
        sumSquares1 += (d.x1-mean1)*(d.x1-mean1);
    }
    else if(d.y==1){
        sumSquares2 += (d.x1-mean2)*(d.x1-mean2);
    }
});

console.log(sumSquares1,sumSquares2);

let datavar = 1/(data.length-2)*(sumSquares1+sumSquares2)
console.log(datavar);


data.forEach(d=>{
    d.disc0 = d.x1*(mean1/datavar)-(mean1*mean1/2*datavar)+Math.log(p0);
    d.disc1 = d.x1*(mean2/datavar)-(mean2*mean2/2*datavar)+Math.log(p1);

    if (d.disc0>d.disc1){
        d.pred = 0;
    } else if (d.disc0<d.disc1){
        d.pred = 1;
    }
});

console.log(data);

let preddots = svg.selectAll('dots')
                .data(data);

    preddots.enter()
                .append('circle')
                .style('fill', 'none')
                .attr('cx',width/2)
                .attr('cy',height/2)                
                .merge(dots)
                .transition()
                .duration(500)
                .attr('class', 'circle')
                .attr('cx',d=>scaleX(d.x1))
                .attr('cy',d=>scaleY(d.y))
                .attr('fill-opacity', 0)
                .attr('r', 5)
                .style('stroke', d=>{
                    if(d.pred==0){return 'pink'}
                    else if(d.pred==1){return '#DE4E45'}
                });

    preddots.exit().remove();

}

lda();
